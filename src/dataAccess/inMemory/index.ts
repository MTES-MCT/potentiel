import {
  CredentialsRepo,
  UserRepo,
  ProjectRepo,
  CandidateNotificationRepo
} from '../'
import {
  Credentials,
  User,
  Project,
  CandidateNotification
} from '../../entities'

interface HasId {
  id?: string
}

const makeClassicRepo = <T extends HasId>(
  defaultProperties: Record<string, any> = {}
) => {
  const itemsById: Record<string, T> = {}
  let itemCount = 0

  return {
    findById: ({ id }) => {
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
        itemsById[itemId] = {
          ...defaultProperties,
          ...item,
          id: itemId
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

const credentialsByEmail: Record<string, Credentials> = {}
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

const usersById: Record<string, User> = {}
let userCounter = 0
const userRepo: UserRepo = {
  findById: ({ id }) => {
    if (id in usersById) {
      return Promise.resolve(usersById[id])
    } else return Promise.resolve(null)
  },
  insert: (user: User) => {
    const userId: string = (++userCounter).toString()
    usersById[userId] = { ...user, id: userId }
    return Promise.resolve(userId)
  }
}

const candidateNotificationRepo: CandidateNotificationRepo = makeClassicRepo<
  CandidateNotification
>()

const projectsById: Record<string, Project> = {}
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
  }
}

export { credentialsRepo, userRepo, projectRepo, candidateNotificationRepo }
