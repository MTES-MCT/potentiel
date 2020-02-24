import makeLogin from './login'

import { credentialsAccess } from '../dataAccess'

import hashPassword from '../helpers/hashPassword'

const login = makeLogin({
  hashFn: hashPassword,
  credentialsAccess
})

const useCases = Object.freeze({
  login
})

export default useCases
export { login }
