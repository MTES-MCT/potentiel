import buildMakeCredentials from './credentials'
import hashFn from '../helpers/hashPassword'

const makeCredentials = buildMakeCredentials({ hashFn })

const entities = Object.freeze({
  makeCredentials
})

export default entities
export { makeCredentials }
