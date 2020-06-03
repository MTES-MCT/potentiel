import { v1 as uuidv1 } from 'uuid'
import hashFn from '../helpers/hashPassword'

import buildMakeCredentials from './credentials'
import buildMakeUser from './user'
import buildMakeProject, { buildApplyProjectUpdate } from './project'
import buildMakeProjectAdmissionKey from './projectAdmissionKey'
import buildMakeModificationRequest from './modificationRequest'
import buildMakePasswordRetrieval from './passwordRetrieval'
import buildMakeNotification from './notification'

const makeId = uuidv1

const makeCredentials = buildMakeCredentials({ hashFn, makeId })
const makeUser = buildMakeUser({ makeId })
const makeProject = buildMakeProject({ makeId })
const applyProjectUpdate = buildApplyProjectUpdate(makeId)
const makeProjectAdmissionKey = buildMakeProjectAdmissionKey({ makeId })
const makeModificationRequest = buildMakeModificationRequest({ makeId })
const makePasswordRetrieval = buildMakePasswordRetrieval({ makeId })
const makeNotification = buildMakeNotification({ makeId })

export {
  makeCredentials,
  makeUser,
  makeProject,
  makeProjectAdmissionKey,
  makeModificationRequest,
  makePasswordRetrieval,
  makeNotification,
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
export * from './notification'
