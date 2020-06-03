import {
  CredentialsRepo,
  UserRepo,
  ProjectRepo,
  ProjectAdmissionKeyRepo,
  ModificationRequestRepo,
  PasswordRetrievalRepo,
  NotificationRepo,
} from '../'
import {
  Credentials,
  User,
  Project,
  Notification,
  ProjectAdmissionKey,
  ModificationRequest,
  PasswordRetrieval,
  ProjectEvent,
  DREAL,
} from '../../entities'
import {
  Ok,
  Err,
  Some,
  None,
  ErrorResult,
  Pagination,
  PaginatedList,
} from '../../types'
import { makePaginatedList } from '../../helpers/paginate'
import _ from 'lodash'

import { appelOffreRepo } from './appelOffre'
const addAppelOffreToProject = async (project: Project): Promise<Project> => {
  project.appelOffre = await appelOffreRepo.findById(
    project.appelOffreId,
    project.periodeId
  )

  project.famille = project.appelOffre?.familles.find(
    (famille) => famille.id === project.familleId
  )

  return project
}

interface HasId {
  id: string
}

const makeClassicRepo = async <T extends HasId>(
  defaultProperties: Record<string, any> = {}
) => {
  let itemsById: Record<string, T> = {}
  let itemCount = 0

  return {
    reset: () => {
      itemsById = {}
      itemCount = 0
    },
    findById: async (id: string) => {
      // console.log('findById', id, itemsById)
      if (id in itemsById) {
        return Some(itemsById[id])
      } else return None
    },
    findAll: async (query?) => {
      const allItems = Object.values(itemsById)

      if (!query) {
        return allItems
      }

      return allItems.filter((item) =>
        Object.entries(query).every(([key, value]) => item[key] === value)
      )
    },
    insert: async (item: T) => {
      itemsById[item.id] = {
        ...defaultProperties,
        ...item,
      }

      return Ok<T>(item)
    },
    update: async (item: T) => {
      if (!item.id) {
        return ErrorResult('Cannot update item that has no id')
      }

      if (!itemsById[item.id]) {
        return ErrorResult('Cannot update item that was unknown')
      }

      itemsById[item.id] = item

      return Ok<T>(item)
    },
  }
}

let credentialsByEmail: Record<string, Credentials> = {}
let credentialsById: Record<string, Credentials> = {}
const credentialsRepo: CredentialsRepo = {
  findByEmail: (email: string) => {
    if (email in credentialsByEmail) {
      return Promise.resolve(Some(credentialsByEmail[email]))
    } else return Promise.resolve(None)
  },
  insert: (credentials: Credentials) => {
    credentialsByEmail[credentials.email] = credentials
    credentialsById[credentials.id] = credentials
    return Promise.resolve(Ok(credentials))
  },
  update: (id: Credentials['id'], hash: Credentials['hash']) => {
    if (!credentialsById[id]) {
      return Promise.resolve(
        ErrorResult('Cannot update credentials that was unknown')
      )
    }

    credentialsById[id].hash = hash

    return Promise.resolve(Ok(credentialsById[id]))
  },
}

let projectAdmissionKeysById: Record<string, ProjectAdmissionKey> = {}
const projectAdmissionKeyRepo: ProjectAdmissionKeyRepo = {
  findById: async (id: string) => {
    // console.log('findById', id, itemsById)
    if (id in projectAdmissionKeysById) {
      return Some(projectAdmissionKeysById[id])
    } else return None
  },
  // @ts-ignore
  findAll: async (query?) => {
    const allItems = Object.values(projectAdmissionKeysById)

    if (!query) {
      return allItems
    }

    return allItems.filter((item) =>
      Object.entries(query).every(([key, value]) => item[key] === value)
    )
  },
  insert: async (item: ProjectAdmissionKey) => {
    projectAdmissionKeysById[item.id] = item

    return Ok(item)
  },
}

let projectsById: Record<string, Project> = {}
async function findAllProjects(
  query?: Record<string, any>
): Promise<Array<Project>>
async function findAllProjects(
  query: Record<string, any>,
  pagination: Pagination
): Promise<PaginatedList<Project>>
async function findAllProjects(
  query?: Record<string, any>,
  pagination?: Pagination
): Promise<PaginatedList<Project> | Array<Project>> {
  const allItems = await Promise.all(
    Object.values(projectsById).map(addAppelOffreToProject)
  )

  if (!query) {
    return pagination
      ? makePaginatedList(allItems, pagination, allItems.length)
      : allItems
  }

  let items = await Promise.all(
    allItems.filter((item) =>
      Object.entries(query).every(([key, value]) => {
        if (key === 'notifiedOn' && value === -1) {
          return item.notifiedOn > 0
        }
        return item[key] === value
      })
    )
  )

  if (pagination) {
    const { page, pageSize } = pagination
    const offset = page * pageSize
    const limit = pageSize

    const pageCount = Math.ceil(items.length / pagination.pageSize)

    items = items.slice(offset, offset + limit)

    return makePaginatedList(items, pagination, pageCount)
  }

  return items
}

const eventsByProjectId: Record<Project['id'], Array<ProjectEvent>> = {}
const projectRepo: ProjectRepo = {
  findById: async (id: string, includeHistory?: boolean) => {
    // console.log('findById', id, itemsById)
    if (id in projectsById) {
      const project = await addAppelOffreToProject(projectsById[id])

      if (includeHistory) {
        project.history = eventsByProjectId[id] || []
      }

      return Some(project)
    } else return None
  },
  findOne: async (query: Record<string, any>) => {
    const allItems = await Promise.all(
      Object.values(projectsById).map(addAppelOffreToProject)
    )

    let items = await Promise.all(
      allItems.filter((item) =>
        Object.entries(query).every(([key, value]) => {
          if (key === 'notifiedOn' && value === -1) {
            return item.notifiedOn > 0
          }
          return item[key] === value
        })
      )
    )

    return items[0]
  },
  findAll: findAllProjects,
  findByUser: (userId: User['id'], excludeUnnotified?: boolean) => {
    const projectIds: Array<Project['id']> = userProjects[userId] || []

    return Promise.all(
      projectIds
        .map((projectId) => projectsById[projectId])
        .filter((item) => !excludeUnnotified || item.notifiedOn !== 0)
        .map(addAppelOffreToProject)
    )
  },
  save: (project: Project) => {
    const { history, ...restOfProject } = project

    projectsById[project.id] = restOfProject

    if (history) {
      history
        .filter((event) => event.isNew)
        .forEach((event) => {
          // Add the new event to the event list
          eventsByProjectId[project.id] = [
            ...(eventsByProjectId[project.id] || []),
            _.omit(event, 'isNew'),
          ]
        })
    }

    // console.log('Calling projectRepo.insert with', project)

    return Promise.resolve(Ok(project))
  },
  remove: async (id: Project['id']) => {
    delete usersById[id]
    return Ok(null)
  },
  getUsers: async (_projectId: Project['id']) => {
    return Object.entries(userProjects)
      .filter(([userId, projectIds]) => projectIds.includes(_projectId))
      .map(([userId]) => usersById[userId])
  },
}

let usersById: Record<string, User> = {}
let userProjects: Record<User['id'], Array<Project['id']>> = {}
let drealUsers: Record<string, Array<User['id']>> = {}
const userRepo: UserRepo = {
  findById: (id: string) => {
    // console.log('findById', id, itemsById)
    if (id in usersById) {
      return Promise.resolve(Some(usersById[id]))
    } else return Promise.resolve(None)
  },
  findAll: (query?) => {
    const allItems = Object.values(usersById)

    if (!query) {
      return Promise.resolve(allItems)
    }

    return Promise.resolve(
      allItems.filter((user) =>
        Object.entries(query).every(([key, value]) => user[key] === value)
      )
    )
  },
  findUsersForDreal: async (dreal: DREAL): Promise<Array<User>> => {
    if (dreal in drealUsers) {
      return drealUsers[dreal].map((userId) => usersById[userId])
    }

    return []
  },
  findDrealsForUser: async (userId: User['id']): Promise<Array<DREAL>> => {
    return Object.entries(drealUsers).reduce(
      (drealsForUser, [dreal, drealUserList]) => {
        if (drealUserList.includes(userId)) {
          drealsForUser.push(dreal)
        }
        return drealsForUser
      },
      [] as Array<string>
    ) as Array<DREAL>
  },
  addToDreal: async (userId: User['id'], dreal: DREAL) => {
    if (!(dreal in drealUsers)) {
      drealUsers[dreal] = []
    }

    drealUsers[dreal].push(userId)

    return Ok(null)
  },
  insert: (user: User) => {
    usersById[user.id] = user

    return Promise.resolve(Ok(user))
  },
  update: (user: User) => {
    if (!user.id) {
      return Promise.resolve(
        Err(new Error('Cannot update user that has no id'))
      )
    }

    if (!usersById[user.id]) {
      return Promise.resolve(
        Err(new Error('Cannot update user that was unknown'))
      )
    }

    usersById[user.id] = user

    return Promise.resolve(Ok(user))
  },
  remove: async (userId: User['id']) => {
    delete usersById[userId]
    return Ok(null)
  },
  addProject: async (userId: User['id'], projectId: Project['id']) => {
    if (!userProjects[userId]) {
      userProjects[userId] = []
    }

    userProjects[userId].push(projectId)
    return Ok(null)
  },
  hasProject: async (userId: User['id'], projectId: Project['id']) => {
    if (!userProjects[userId]) {
      return false
    }

    return userProjects[userId].includes(projectId)
  },
}

let modificationRequestsById: Record<string, ModificationRequest> = {}
const modificationRequestRepo: ModificationRequestRepo = {
  findById: async (id: string) => {
    // console.log('findById', id, itemsById)
    if (id in modificationRequestsById) {
      return Some(modificationRequestsById[id])
    } else return None
  },
  findAll: async (query?) => {
    const allItems = Object.values(modificationRequestsById)

    if (!query) {
      return allItems
    }

    return allItems.filter((item) =>
      Object.entries(query).every(([key, value]) => item[key] === value)
    )
  },
  insert: async (item: ModificationRequest) => {
    modificationRequestsById[item.id] = item

    return Ok(item)
  },
  update: async (item: ModificationRequest) => {
    if (!item.id) {
      return ErrorResult('Cannot update item that has no id')
    }

    if (!modificationRequestsById[item.id]) {
      return ErrorResult('Cannot update item that was unknown')
    }

    modificationRequestsById[item.id] = item

    return Ok(item)
  },
}

let passwordRetrievalsById: Record<string, PasswordRetrieval> = {}
const passwordRetrievalRepo: PasswordRetrievalRepo = {
  findById: async (id: string) => {
    // console.log('findById', id, itemsById)
    if (id in passwordRetrievalsById) {
      return Some(passwordRetrievalsById[id])
    } else return None
  },
  insert: async (item: PasswordRetrieval) => {
    passwordRetrievalsById[item.id] = item

    return Ok(item)
  },
  remove: async (id: string) => {
    if (!passwordRetrievalsById[id]) {
      return ErrorResult('Cannot delete unknown item')
    }

    delete passwordRetrievalsById[id]

    return Ok(null)
  },
  countSince: async (email: string, since: number) => {
    return Object.values(passwordRetrievalsById).filter(
      (item) => item.email === email && item.createdOn >= since
    ).length
  },
}

let notificationsById: Record<string, Notification> = {}
const notificationRepo: NotificationRepo = {
  save: async (item: Notification) => {
    notificationsById[item.id] = item

    return Ok(null)
  },
  findAll: async () => {
    return Object.values(notificationsById)
  },
}

const resetDatabase = () => {
  credentialsByEmail = {}
  projectsById = {}
  usersById = {}
  userProjects = {}
  projectAdmissionKeysById = {}
  modificationRequestsById = {}
  passwordRetrievalsById = {}
  notificationsById = {}
}

export {
  credentialsRepo,
  userRepo,
  projectRepo,
  projectAdmissionKeyRepo,
  modificationRequestRepo,
  passwordRetrievalRepo,
  appelOffreRepo,
  notificationRepo,
  resetDatabase,
}
export * from './appelOffre'
