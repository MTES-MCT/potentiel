import {
  userRepo,
  credentialsRepo,
  projectRepo,
  candidateNotificationRepo,
  projectAdmissionKeyRepo
} from './db'

if (process.env.NODE_ENV === 'unit-test') {
  console.log('DO NOT USE THESE DEFAULT DATA ACCESS REPOS (DB) IN UNIT TESTS')
  console.log("Use: import { xxxRepo } from 'dataAccess/inMemory'")
  process.exit(1)
}

const dataAccess = Object.freeze({
  credentialsRepo,
  userRepo,
  projectRepo,
  candidateNotificationRepo,
  projectAdmissionKeyRepo
})

export default dataAccess
export {
  credentialsRepo,
  userRepo,
  projectRepo,
  candidateNotificationRepo,
  projectAdmissionKeyRepo
}

export * from './user'
export * from './credentials'
export * from './project'
export * from './candidateNotification'
export * from './projectAdmissionKey'
