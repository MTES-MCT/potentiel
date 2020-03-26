import { v1 as uuidv1 } from 'uuid'
import hashFn from '../helpers/hashPassword'

import buildMakeCredentials from './credentials'
import buildMakeUser from './user'
import buildMakeProject from './project'
import buildMakeCandidateNotification from './candidateNotification'
import buildMakeProjectAdmissionKey from './projectAdmissionKey'
import buildMakeModificationRequest from './modificationRequest'

const makeId = uuidv1

const makeCredentials = buildMakeCredentials({ hashFn, makeId })
const makeUser = buildMakeUser({ makeId })
const makeProject = buildMakeProject({ makeId })
const makeCandidateNotification = buildMakeCandidateNotification({
  makeId
})
const makeProjectAdmissionKey = buildMakeProjectAdmissionKey({ makeId })
const makeModificationRequest = buildMakeModificationRequest({ makeId })

export {
  makeCredentials,
  makeUser,
  makeProject,
  makeCandidateNotification,
  makeProjectAdmissionKey,
  makeModificationRequest
}
export * from './user'
export * from './credentials'
export * from './project'
export * from './candidateNotification'
export * from './projectAdmissionKey'
export * from './modificationRequest'
