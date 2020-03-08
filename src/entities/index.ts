import hashFn from '../helpers/hashPassword'

import buildMakeCredentials from './credentials'
import buildMakeUser from './user'
import buildMakeProject from './project'
import buildMakeCandidateNotification from './candidateNotification'
import buildMakeProjectAdmissionKey from './projectAdmissionKey'

const makeCredentials = buildMakeCredentials({ hashFn })
const makeUser = buildMakeUser()
const makeProject = buildMakeProject()
const makeCandidateNotification = buildMakeCandidateNotification()
const makeProjectAdmissionKey = buildMakeProjectAdmissionKey()

const entities = Object.freeze({
  makeCredentials,
  makeUser,
  makeProject,
  makeCandidateNotification,
  makeProjectAdmissionKey
})

export default entities
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
