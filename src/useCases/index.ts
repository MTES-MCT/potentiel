import makeLogin from './login'

import { credentialsRepo, userRepo } from '../dataAccess'

import hashPassword from '../helpers/hashPassword'

const login = makeLogin({
  hashFn: hashPassword,
  credentialsRepo,
  userRepo
})

const useCases = Object.freeze({
  login
})

export default useCases
export { login }
