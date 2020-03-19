import { v1 as uuidv1 } from 'uuid'
import hashFn from '../helpers/hashPassword'

import buildMakeCredentials from './credentials'
import buildMakeUser from './user'
import buildMakeProject from './project'
import buildMakeCandidateNotification from './candidateNotification'
import buildMakeProjectAdmissionKey from './projectAdmissionKey'

const makeId = uuidv1

const makeCredentials = buildMakeCredentials({ hashFn, makeId })
const makeUser = buildMakeUser({ makeId })
const makeProject = buildMakeProject({ makeId })
const makeCandidateNotification = buildMakeCandidateNotification({
  makeId
})
const makeProjectAdmissionKey = buildMakeProjectAdmissionKey({ makeId })

export {
  makeCredentials,
  makeUser,
  makeProject,
  makeCandidateNotification,
  makeProjectAdmissionKey
}
export * from './user'
export * from './credentials'
export * from './project'
export * from './candidateNotification'
export * from './projectAdmissionKey'
