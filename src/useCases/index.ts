import makeLogin from './login'

import { credentialsAccess, userAccess } from '../dataAccess'

import hashPassword from '../helpers/hashPassword'

const login = makeLogin({
  hashFn: hashPassword,
  credentialsAccess,
  userAccess
})

const useCases = Object.freeze({
  login
})

export default useCases
export { login }
