import {
  CredentialsRepo,
  UserRepo,
  ProjectRepo,
  CandidateNotificationRepo,
  ProjectAdmissionKeyRepo
} from '../'
import {
  Credentials,
  User,
  Project,
  CandidateNotification,
  ProjectAdmissionKey
} from '../../entities'

interface HasId {
  id?: string
}

const makeClassicRepo = <T extends HasId>(
  defaultProperties: Record<string, any> = {}
) => {
  let itemsById: Record<string, T> = {}
  let itemCount = 0

  return {
    reset: () => {
      itemsById = {}
      itemCount = 0
    },
    findById: ({ id }) => {
      // console.log('findById', id, itemsById)
      if (id in itemsById) {
        return Promise.resolve(itemsById[id])
      } else return Promise.resolve(null)
    },
    findAll: (query?) => {
      const allItems = Object.values(itemsById)

      if (!query) {
        return Promise.resolve(allItems)
      }

      return Promise.resolve(
        allItems.filter(item =>
          Object.entries(query).every(([key, value]) => item[key] === value)
        )
      )
    },
    insertMany: (items: Array<T>) => {
      items.forEach(item => {
        const itemId: string = (++itemCount).toString()
        itemsById[item.id || itemId] = {
          ...defaultProperties,
          id: itemId,
          ...item
        }
      })

      return Promise.resolve()
    },
    update: (item: T) => {
      if (!item.id) {
        throw new Error('Cannot update item that has no id')
      }

      if (!itemsById[item.id]) {
        throw new Error('Cannot update item that was unknown')
      }

      itemsById[item.id] = item

      return Promise.resolve()
    }
  }
}

let credentialsByEmail: Record<string, Credentials> = {}
const credentialsRepo: CredentialsRepo = {
  findByEmail: ({ email }) => {
    if (email in credentialsByEmail) {
      return Promise.resolve(credentialsByEmail[email])
    } else return Promise.resolve(null)
  },
  insert: (credentials: Credentials) => {
    credentialsByEmail[credentials.email] = credentials
    return Promise.resolve()
  }
}

const candidateNotificationRepo = makeClassicRepo<CandidateNotification>()

const projectAdmissionKeyRepo = makeClassicRepo<ProjectAdmissionKey>()

let projectsById: Record<string, Project> = {}
let projectCount = 0
const projectRepo: ProjectRepo = {
  findById: ({ id }) => {
    if (id in projectsById) {
      return Promise.resolve(projectsById[id])
    } else return Promise.resolve(null)
  },
  findAll: (query?) => {
    const allItems = Object.values(projectsById)

    if (!query) {
      return Promise.resolve(allItems)
    }

    return Promise.resolve(
      allItems.filter(project =>
        Object.entries(query).every(([key, value]) => project[key] === value)
      )
    )
  },
  insertMany: (projects: Array<Project>) => {
    projects.forEach(project => {
      const projectId: string = (++projectCount).toString()
      projectsById[projectId] = {
        hasBeenNotified: false,
        ...project,
        id: projectId
      }
    })

    return Promise.resolve()
  },
  update: (project: Project) => {
    if (!project.id) {
      throw new Error('Cannot update project that has no id')
    }

    if (!projectsById[project.id]) {
      throw new Error('Cannot update project that was unknown')
    }

    projectsById[project.id] = project

    return Promise.resolve()
  },
  addNotification: async (
    project: Project,
    notification: CandidateNotification
  ) => {
    const projectInstance = projectsById[project.id]

    if (!projectInstance) {
      throw new Error('Cannot find project to add notification to')
    }

    await candidateNotificationRepo.insertMany([
      { ...notification, projectId: project.id }
    ])

    projectInstance.hasBeenNotified = true
  },
  addProjectAdmissionKey: async (
    projectId: Project['id'],
    key: ProjectAdmissionKey['id'],
    email: ProjectAdmissionKey['email']
  ) => {
    const projectInstance = projectsById[projectId]

    if (!projectInstance) {
      throw new Error('Cannot find project to add project admission key to')
    }

    await projectAdmissionKeyRepo.insertMany([{ id: key, projectId, email }])
  }
}

let usersById: Record<string, User> = {}
let userProjects: Record<User['id'], Array<Project['id']>> = {}
let userCounter = 0
const userRepo: UserRepo = {
  findById: (id: User['id']) => {
    if (id in usersById) {
      return Promise.resolve(usersById[id])
    } else return Promise.resolve(null)
  },
  insert: (user: User) => {
    const userId: string = (++userCounter).toString()
    usersById[userId] = { ...user, id: userId }
    return Promise.resolve(userId)
  },
  findProjects: async (userId: User['id']) => {
    const projectIds: Array<Project['id']> = userProjects[userId] || []

    return projectIds.map(projectId => projectsById[projectId])
  },
  remove: async (userId: User['id']) => {
    delete usersById[userId]
  },
  addProject: async (userId: User['id'], projectId: Project['id']) => {
    if (!userProjects[userId]) {
      userProjects[userId] = []
    }

    userProjects[userId].push(projectId)
  }
}

const resetDatabase = () => {
  credentialsByEmail = {}
  projectsById = {}
  projectCount = 0
  usersById = {}
  userProjects = {}
  userCounter = 0
  candidateNotificationRepo.reset()
  projectAdmissionKeyRepo.reset()
}

export {
  credentialsRepo,
  userRepo,
  projectRepo,
  candidateNotificationRepo,
  projectAdmissionKeyRepo,
  resetDatabase
}
