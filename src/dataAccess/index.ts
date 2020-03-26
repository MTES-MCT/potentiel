if (process.env.NODE_ENV === 'unit-test') {
  console.log('DO NOT USE THESE DEFAULT DATA ACCESS REPOS (DB) IN UNIT TESTS')
  console.log("Use: import { xxxRepo } from 'dataAccess/inMemory'")
  process.exit(1)
}

export * from './db'

export * from './user'
export * from './credentials'
export * from './project'
export * from './candidateNotification'
export * from './projectAdmissionKey'
export * from './modificationRequest'
