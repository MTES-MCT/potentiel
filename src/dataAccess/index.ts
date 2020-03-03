import { userRepo, credentialsRepo, projectRepo } from './db'

const dataAccess = Object.freeze({
  credentialsRepo,
  userRepo,
  projectRepo
})

export default dataAccess
export { credentialsRepo, userRepo, projectRepo }

export * from './user'
export * from './credentials'
export * from './project'
