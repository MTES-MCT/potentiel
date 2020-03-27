import makeLogin from './login'
import makeImportProjects from './importProjects'
import makeListProjects from './listProjects'
import makeListUserProjects from './listUserProjects'
import makeSendCandidateNotifications from './sendCandidateNotifications'
import makeShowNotification from './showNotification'
import makeSignup from './signup'
import makeRequestModification from './requestModification'
import makeListUserRequests from './listUserRequests'

import {
  credentialsRepo,
  userRepo,
  projectRepo,
  candidateNotificationRepo,
  projectAdmissionKeyRepo,
  modificationRequestRepo
} from '../dataAccess'

const login = makeLogin({
  credentialsRepo,
  userRepo
})

const importProjects = makeImportProjects({
  projectRepo
})

const listProjects = makeListProjects({ projectRepo })

const sendCandidateNotifications = makeSendCandidateNotifications({
  projectRepo,
  userRepo,
  credentialsRepo,
  candidateNotificationRepo,
  projectAdmissionKeyRepo
})

const showNotification = makeShowNotification({
  candidateNotificationRepo
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

const useCases = Object.freeze({
  login,
  importProjects,
  listProjects,
  listUserProjects,
  sendCandidateNotifications,
  showNotification,
  signup,
  requestModification,
  listUserRequests
})

export default useCases
export {
  login,
  importProjects,
  listProjects,
  listUserProjects,
  sendCandidateNotifications,
  showNotification,
  signup,
  requestModification,
  listUserRequests
}
