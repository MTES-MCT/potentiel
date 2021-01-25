import { logger } from '../core/utils'

if (process.env.NODE_ENV === 'test' && process.env.TEST === 'unit') {
  logger.info(
    'DO NOT USE THESE DEFAULT DATA ACCESS REPOS (DB) IN UNIT TESTS. Use: import { xxxRepo } from "dataAccess/inMemory"'
  )
  process.exit(1)
}

export * from './db'

export * from './user'
export * from './credentials'
export * from './project'
export * from './projectAdmissionKey'
export * from './modificationRequest'
export * from './appelOffre'
export * from './passwordRetrieval'
