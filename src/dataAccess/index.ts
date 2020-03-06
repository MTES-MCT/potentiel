import {
  userRepo,
  credentialsRepo,
  projectRepo,
  candidateNotificationRepo
} from './db'

const dataAccess = Object.freeze({
  credentialsRepo,
  userRepo,
  projectRepo,
  candidateNotificationRepo
})

export default dataAccess
export { credentialsRepo, userRepo, projectRepo, candidateNotificationRepo }

export * from './user'
export * from './credentials'
export * from './project'
export * from './candidateNotification'
