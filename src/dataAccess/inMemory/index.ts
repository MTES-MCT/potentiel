import { CredentialsRepo } from '../credentials'
import { Credentials, User } from '../../entities'
import { UserRepo } from '../user'

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

export { credentialsRepo, userRepo }
