import makeLogin from './login'
import makeImportProjects from './importProjects'
import makeListProjects from './listProjects'
import makeListUserProjects from './listUserProjects'
import makeSendCandidateNotification from './sendCandidateNotification'
import makeSendAllCandidateNotifiations from './sendAllCandidateNotifications'
import makeSignup from './signup'
import makeRequestModification from './requestModification'
import makeListUserRequests from './listUserRequests'
import makeListAllRequests from './listAllRequests'
import makeListUnnotifiedProjects from './listUnnotifiedProjects'
import makeGetUserProject from './getUserProject'
import makeRetrievePassword from './retrievePassword'
import makeResetPassword from './resetPassword'
import makeShouldUserAccessProject from './shouldUserAccessProject'
import makeInviteUserToProject from './inviteUserToProject'

import {
  sendEmailNotification,
  sendPasswordResetEmail,
  sendEmailInvitation,
} from '../helpers/sendEmailNotification'

import {
  credentialsRepo,
  userRepo,
  projectRepo,
  candidateNotificationRepo,
  projectAdmissionKeyRepo,
  modificationRequestRepo,
  appelOffreRepo,
  passwordRetrievalRepo,
} from '../dataAccess'

const login = makeLogin({
  credentialsRepo,
  userRepo,
})

const importProjects = makeImportProjects({
  projectRepo,
  appelOffreRepo,
})

const listProjects = makeListProjects({ projectRepo })
const listUnnotifiedProjects = makeListUnnotifiedProjects({ projectRepo })

const sendCandidateNotification = makeSendCandidateNotification({
  projectRepo,
  projectAdmissionKeyRepo,
  appelOffreRepo,
  sendEmailNotification,
})

const sendAllCandidateNotifications = makeSendAllCandidateNotifiations({
  projectRepo,
  userRepo,
  credentialsRepo,
  candidateNotificationRepo,
  sendCandidateNotification,
})

const signup = makeSignup({
  userRepo,
  credentialsRepo,
  projectAdmissionKeyRepo,
  projectRepo,
})

const listUserProjects = makeListUserProjects({ projectRepo })

const requestModification = makeRequestModification({ modificationRequestRepo })

const listUserRequests = makeListUserRequests({ modificationRequestRepo })
const listAllRequests = makeListAllRequests({ modificationRequestRepo })

const shouldUserAccessProject = makeShouldUserAccessProject({ userRepo })
const getUserProject = makeGetUserProject({
  projectRepo,
  shouldUserAccessProject,
})

const retrievePassword = makeRetrievePassword({
  credentialsRepo,
  passwordRetrievalRepo,
  sendPasswordResetEmail,
})

const resetPassword = makeResetPassword({
  credentialsRepo,
  passwordRetrievalRepo,
})

const inviteUserToProject = makeInviteUserToProject({
  projectRepo,
  credentialsRepo,
  userRepo,
  projectAdmissionKeyRepo,
  shouldUserAccessProject,
  sendEmailInvitation,
})

const useCases = Object.freeze({
  login,
  importProjects,
  listProjects,
  listUserProjects,
  sendCandidateNotification,
  sendAllCandidateNotifications,
  signup,
  requestModification,
  listUserRequests,
  listAllRequests,
  listUnnotifiedProjects,
  getUserProject,
  retrievePassword,
  resetPassword,
  shouldUserAccessProject,
  inviteUserToProject,
})

export default useCases
export {
  login,
  importProjects,
  listProjects,
  listUserProjects,
  sendCandidateNotification,
  sendAllCandidateNotifications,
  signup,
  requestModification,
  listUserRequests,
  listAllRequests,
  listUnnotifiedProjects,
  getUserProject,
  retrievePassword,
  resetPassword,
  shouldUserAccessProject,
  inviteUserToProject,
}
