import {
  CredentialsRepo,
  UserRepo,
  ProjectAdmissionKeyRepo,
  ModificationRequestRepo,
  PasswordRetrievalRepo,
} from '../'
import {
  Credentials,
  User,
  Project,
  ProjectAdmissionKey,
  ModificationRequest,
  PasswordRetrieval,
  DREAL,
} from '../../entities'
import { Ok, Err, Some, None, ErrorResult, Pagination, PaginatedList } from '../../types'
import { makePaginatedList } from '../../helpers/paginate'

import { appelOffreRepo } from './appelOffre'

let credentialsByEmail: Record<string, Credentials> = {}
const credentialsById: Record<string, Credentials> = {}
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
      return Promise.resolve(ErrorResult('Cannot update credentials that was unknown'))
    }

    credentialsById[id].hash = hash

    return Promise.resolve(Ok(credentialsById[id]))
  },
}

let projectAdmissionKeysById: Record<string, ProjectAdmissionKey> = {}

const projectAdmissionKeyRepo: ProjectAdmissionKeyRepo = {
  findById: async (id: string) => {
    if (id in projectAdmissionKeysById) {
      return Some(projectAdmissionKeysById[id])
    } else return None
  },
  findAll: async (query?: Record<string, any>): Promise<Array<ProjectAdmissionKey>> => {
    const allItems = Object.values(projectAdmissionKeysById)

    if (!query) {
      return allItems
    }

    const items = allItems.filter((item) =>
      Object.entries(query).every(([key, value]) => {
        if (key === 'dreal' && value === -1) {
          return !!item.dreal
        }

        if (key === 'dreal' && value === null) {
          return !item.dreal
        }

        if (key === 'projectId' && value === null) {
          return !item.projectId
        }

        if (key === 'createdAt' && typeof value === 'object' && typeof value.before === 'number') {
          return typeof item.createdAt !== 'undefined' && item.createdAt <= value.before
        }

        return item[key] === value
      })
    )

    return items
  },
  getList: async (
    query: Record<string, any>,
    pagination: Pagination
  ): Promise<PaginatedList<ProjectAdmissionKey>> => {
    const allItems = Object.values(projectAdmissionKeysById)

    let items = allItems.filter((item) =>
      Object.entries(query).every(([key, value]) => {
        if (key === 'dreal' && value === -1) {
          return !!item.dreal
        }

        if (key === 'dreal' && value === null) {
          return !item.dreal
        }

        if (key === 'projectId' && value === null) {
          return !item.projectId
        }

        if (key === 'createdAt' && typeof value === 'object' && typeof value.before === 'number') {
          return typeof item.createdAt !== 'undefined' && item.createdAt <= value.before
        }

        return item[key] === value
      })
    )

    const { page, pageSize } = pagination
    const offset = page * pageSize
    const limit = pageSize

    const pageCount = Math.ceil(items.length / pagination.pageSize)

    items = items.slice(offset, offset + limit)

    return makePaginatedList(items, pageCount, pagination)
  },
  save: async (item: ProjectAdmissionKey) => {
    projectAdmissionKeysById[item.id] = item

    return Ok(null)
  },
}

let usersById: Record<string, User> = {}
let userProjects: Record<User['id'], Array<Project['id']>> = {}
const drealUsers: Record<string, Array<User['id']>> = {}
const userRepo: UserRepo = {
  findById: (id: string) => {
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
      allItems.filter((user) => Object.entries(query).every(([key, value]) => user[key] === value))
    )
  },
  findUsersForDreal: async (dreal: DREAL): Promise<Array<User>> => {
    if (dreal in drealUsers) {
      return drealUsers[dreal].map((userId) => usersById[userId])
    }

    return []
  },
  findDrealsForUser: async (userId: User['id']): Promise<Array<DREAL>> => {
    return Object.entries(drealUsers).reduce((drealsForUser, [dreal, drealUserList]) => {
      if (drealUserList.includes(userId)) {
        drealsForUser.push(dreal)
      }
      return drealsForUser
    }, [] as Array<string>) as Array<DREAL>
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
      return Promise.resolve(Err(new Error('Cannot update user that has no id')))
    }

    if (!usersById[user.id]) {
      return Promise.resolve(Err(new Error('Cannot update user that was unknown')))
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
  addUserToProjectsWithEmail: async (userId: User['id'], email: Project['email']) => Ok(null),
  addProjectToUserWithEmail: async (projectId: Project['id'], email: Project['email']) => Ok(null),
}

let modificationRequestsById: Record<string, ModificationRequest> = {}
const modificationRequestRepo: ModificationRequestRepo = {
  findById: async (id: string) => {
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

const resetDatabase = () => {
  credentialsByEmail = {}
  usersById = {}
  userProjects = {}
  projectAdmissionKeysById = {}
  modificationRequestsById = {}
  passwordRetrievalsById = {}
}

export {
  credentialsRepo,
  userRepo,
  projectAdmissionKeyRepo,
  modificationRequestRepo,
  passwordRetrievalRepo,
  appelOffreRepo,
  resetDatabase,
}
export * from './appelOffre'
