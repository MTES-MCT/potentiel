import makeLogin from './login'
import makeImportProjects from './importProjects'

import { credentialsRepo, userRepo, projectRepo } from '../dataAccess'

import hashPassword from '../helpers/hashPassword'

const login = makeLogin({
  hashFn: hashPassword,
  credentialsRepo,
  userRepo
})

const importProjects = makeImportProjects({
  projectRepo
})

const useCases = Object.freeze({
  login,
  importProjects
})

export default useCases
export { login, importProjects }
