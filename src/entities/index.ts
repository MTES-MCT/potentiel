import buildMakeCredentials from './credentials'
import buildMakeUser from './user'
import buildMakeProject from './project'
import buildMakeCandidateNotification from './candidateNotification'
import hashFn from '../helpers/hashPassword'

const makeCredentials = buildMakeCredentials({ hashFn })
const makeUser = buildMakeUser()
const makeProject = buildMakeProject()
const makeCandidateNotification = buildMakeCandidateNotification()

const entities = Object.freeze({
  makeCredentials,
  makeUser,
  makeProject,
  makeCandidateNotification
})

export default entities
export { makeCredentials, makeUser, makeProject, makeCandidateNotification }
export * from './user'
export * from './credentials'
export * from './project'
export * from './candidateNotification'
