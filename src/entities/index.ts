import { v4 as uuidv4 } from 'uuid'
import hashFn from '../helpers/hashPassword'

import buildMakeCredentials from './credentials'
import buildMakeUser from './user'
import buildMakeProject, { buildApplyProjectUpdate } from './project'
import buildMakeProjectAdmissionKey from './projectAdmissionKey'
import buildMakeModificationRequest from './modificationRequest'
import buildMakePasswordRetrieval from './passwordRetrieval'

const makeId = uuidv4

const makeCredentials = buildMakeCredentials({ hashFn, makeId })
const makeUser = buildMakeUser({ makeId })
const makeProject = buildMakeProject({ makeId })
const applyProjectUpdate = buildApplyProjectUpdate(makeId)
const makeProjectAdmissionKey = buildMakeProjectAdmissionKey({ makeId })
const makeModificationRequest = buildMakeModificationRequest({ makeId })
const makePasswordRetrieval = buildMakePasswordRetrieval({ makeId })

export {
  makeCredentials,
  makeUser,
  makeProject,
  makeProjectAdmissionKey,
  makeModificationRequest,
  makePasswordRetrieval,
  applyProjectUpdate,
}

export * from './user'
export * from './credentials'
export * from './project'
export * from './projectAdmissionKey'
export * from './modificationRequest'
export * from './appelOffre'
export * from './famille'
export * from './periode'
export * from './passwordRetrieval'
export * from './dreal'
