import makeLogin from './login'
import makeImportProjects from './importProjects'
import makeListProjects from './listProjects'
import makeListUserProjects from './listUserProjects'
import makeSendCandidateNotifications from './sendCandidateNotifications'
import makeSignup from './signup'
import makeRequestModification from './requestModification'
import makeListUserRequests from './listUserRequests'
import makeListAllRequests from './listAllRequests'
import makeListUnnotifiedProjects from './listUnnotifiedProjects'

import {
  credentialsRepo,
  userRepo,
  projectRepo,
  candidateNotificationRepo,
  projectAdmissionKeyRepo,
  modificationRequestRepo,
  appelOffreRepo
} from '../dataAccess'

const login = makeLogin({
  credentialsRepo,
  userRepo
})

const importProjects = makeImportProjects({
  projectRepo,
  appelOffreRepo
})

const listProjects = makeListProjects({ projectRepo })
const listUnnotifiedProjects = makeListUnnotifiedProjects({ projectRepo })

const sendCandidateNotifications = makeSendCandidateNotifications({
  projectRepo,
  userRepo,
  credentialsRepo,
  candidateNotificationRepo,
  projectAdmissionKeyRepo
})

const signup = makeSignup({
  userRepo,
  credentialsRepo,
  projectAdmissionKeyRepo,
  projectRepo
})

const listUserProjects = makeListUserProjects({ projectRepo })

const requestModification = makeRequestModification({ modificationRequestRepo })

const listUserRequests = makeListUserRequests({ modificationRequestRepo })
const listAllRequests = makeListAllRequests({ modificationRequestRepo })

const useCases = Object.freeze({
  login,
  importProjects,
  listProjects,
  listUserProjects,
  sendCandidateNotifications,
  signup,
  requestModification,
  listUserRequests,
  listAllRequests,
  listUnnotifiedProjects
})

export default useCases
export {
  login,
  importProjects,
  listProjects,
  listUserProjects,
  sendCandidateNotifications,
  signup,
  requestModification,
  listUserRequests,
  listAllRequests,
  listUnnotifiedProjects
}
