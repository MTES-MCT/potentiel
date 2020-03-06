import makeLogin from './login'
import makeImportProjects from './importProjects'
import makeListProjects from './listProjects'
import makeSendCandidateNotifications from './sendCandidateNotifications'

import {
  credentialsRepo,
  userRepo,
  projectRepo,
  candidateNotificationRepo
} from '../dataAccess'

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

const sendCandidateNotifications = makeSendCandidateNotifications({
  projectRepo,
  candidateNotificationRepo
})

const useCases = Object.freeze({
  login,
  importProjects,
  listProjects,
  sendCandidateNotifications
})

export default useCases
export { login, importProjects, listProjects, sendCandidateNotifications }
