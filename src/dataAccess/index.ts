import { userRepo, credentialsRepo } from './db'

const dataAccess = Object.freeze({
  credentialsRepo,
  userRepo
})

export default dataAccess
export { credentialsRepo, userRepo }

export * from './user'
export * from './credentials'
