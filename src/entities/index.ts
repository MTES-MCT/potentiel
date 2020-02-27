import buildMakeCredentials from './credentials'
import buildMakeUser from './user'
import hashFn from '../helpers/hashPassword'

const makeCredentials = buildMakeCredentials({ hashFn })
const makeUser = buildMakeUser()

const entities = Object.freeze({
  makeCredentials,
  makeUser
})

export default entities
export { makeCredentials, makeUser }
export * from './user'
export * from './credentials'
