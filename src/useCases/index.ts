import makeLogin from './login'
import makeImportProjects from './importProjects'
import makeListProjects from './listProjects'

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

const listProjects = makeListProjects({ projectRepo })

const useCases = Object.freeze({
  login,
  importProjects,
  listProjects
})

export default useCases
export { login, importProjects, listProjects }
