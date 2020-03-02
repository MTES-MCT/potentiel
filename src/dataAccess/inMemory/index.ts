import { CredentialsRepo } from '../credentials'
import { Credentials, User } from '../../entities'
import { UserRepo } from '../user'
import { Project } from '../../entities'
import { ProjectRepo } from '../project'

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
    usersById[userId] = user
    return Promise.resolve(userId)
  }
}

const projects: Array<Project> = []
const projectRepo: ProjectRepo = {
  findAll: () => {
    return Promise.resolve(projects)
  },
  insertMany: (_projects: Array<Project>) => {
    _projects.forEach(project => projects.push(project))
    return Promise.resolve()
  }
}

export { credentialsRepo, userRepo, projectRepo }
