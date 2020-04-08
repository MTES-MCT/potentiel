import {
  CredentialsRepo,
  UserRepo,
  ProjectRepo,
  CandidateNotificationRepo,
  ProjectAdmissionKeyRepo,
  ModificationRequestRepo,
} from '../'
import {
  Credentials,
  User,
  Project,
  CandidateNotification,
  ProjectAdmissionKey,
  ModificationRequest,
} from '../../entities'
import { Ok, Err, Some, None, ErrorResult } from '../../types'

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
  update: (credentials: Credentials) => {
    if (!credentials.id) {
      return Promise.resolve(
        ErrorResult('Cannot update credentials that has no id')
      )
    }

    if (!credentialsById[credentials.id]) {
      return Promise.resolve(
        ErrorResult('Cannot update credentials that was unknown')
      )
    }

    credentialsById[credentials.id] = credentials

    return Promise.resolve(Ok(credentials))
  },
}

let candidateNotificationsById: Record<string, CandidateNotification> = {}
const candidateNotificationRepo: CandidateNotificationRepo = {
  findById: async (id: string) => {
    // console.log('findById', id, itemsById)
    if (id in candidateNotificationsById) {
      return Some(candidateNotificationsById[id])
    } else return None
  },
  findAll: async (query?) => {
    const allItems = Object.values(candidateNotificationsById)

    if (!query) {
      return allItems
    }

    return allItems.filter((item) =>
      Object.entries(query).every(([key, value]) => item[key] === value)
    )
  },
  insert: async (item: CandidateNotification) => {
    candidateNotificationsById[item.id] = item

    return Ok(item)
  },
  update: async (item: CandidateNotification) => {
    if (!item.id) {
      return ErrorResult('Cannot update item that has no id')
    }

    if (!candidateNotificationsById[item.id]) {
      return ErrorResult('Cannot update item that was unknown')
    }

    candidateNotificationsById[item.id] = item

    return Ok(item)
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
    const allItems = Object.values(candidateNotificationsById)

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
const projectRepo: ProjectRepo = {
  findById: (id: string) => {
    // console.log('findById', id, itemsById)
    if (id in projectsById) {
      return Promise.resolve(Some(projectsById[id]))
    } else return Promise.resolve(None)
  },
  findAll: (query?, includeNotifications?: boolean) => {
    const allItems = Object.values(projectsById)

    if (!query) {
      return Promise.resolve(allItems)
    }

    return Promise.all(
      allItems
        .filter((item) =>
          Object.entries(query).every(([key, value]) => item[key] === value)
        )
        .map(async (item) => {
          if (includeNotifications) {
            item.candidateNotifications = await candidateNotificationRepo.findAll(
              {
                projectId: item.id,
              }
            )
          }
          return item
        })
    )
  },
  findByUser: (userId: User['id']) => {
    const projectIds: Array<Project['id']> = userProjects[userId] || []

    return Promise.resolve(
      projectIds.map((projectId) => projectsById[projectId])
    )
  },
  insert: (project: Project) => {
    projectsById[project.id] = project

    // console.log('Calling projectRepo.insert with', project)

    return Promise.resolve(Ok(project))
  },
  update: (project: Project) => {
    if (!project.id) {
      return Promise.resolve(
        Err(new Error('Cannot update project that has no id'))
      )
    }

    if (!projectsById[project.id]) {
      return Promise.resolve(
        Err(new Error('Cannot update project that was unknown'))
      )
    }

    projectsById[project.id] = project

    return Promise.resolve(Ok(project))
  },
  remove: async (id: Project['id']) => {
    delete usersById[id]
    return Ok(null)
  },
  addNotification: async (
    project: Project,
    notification: CandidateNotification
  ) => {
    const projectInstance = projectsById[project.id]

    if (!projectInstance) {
      return Err(new Error('Cannot find project to add notification to'))
    }

    await candidateNotificationRepo.insert({
      ...notification,
      projectId: project.id,
    })

    return Ok(project)
  },
}

let usersById: Record<string, User> = {}
let userProjects: Record<User['id'], Array<Project['id']>> = {}
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

const resetDatabase = () => {
  credentialsByEmail = {}
  projectsById = {}
  usersById = {}
  userProjects = {}
  candidateNotificationsById = {}
  projectAdmissionKeysById = {}
  modificationRequestsById = {}
}

export {
  credentialsRepo,
  userRepo,
  projectRepo,
  candidateNotificationRepo,
  projectAdmissionKeyRepo,
  modificationRequestRepo,
  resetDatabase,
}
export * from './appelOffre'
