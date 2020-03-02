import buildMakeCredentials from './credentials'
import buildMakeUser from './user'
import buildMakeProject from './project'
import hashFn from '../helpers/hashPassword'

const makeCredentials = buildMakeCredentials({ hashFn })
const makeUser = buildMakeUser()
const makeProject = buildMakeProject()

const entities = Object.freeze({
  makeCredentials,
  makeUser,
  makeProject
})

export default entities
export { makeCredentials, makeUser, makeProject }
export * from './user'
export * from './credentials'
export * from './project'
