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
import makeAddGarantiesFinancieres from './addGarantiesFinancieres'
import makeInviteDreal from './inviteDreal'
import makeListGarantiesFinancieres from './listGarantiesFinancieres'
import makeSendNotification from './sendNotification'

import { sendEmail } from '../helpers/sendEmailNotification'

import {
  credentialsRepo,
  userRepo,
  projectRepo,
  projectAdmissionKeyRepo,
  modificationRequestRepo,
  appelOffreRepo,
  passwordRetrievalRepo,
  notificationRepo,
} from '../dataAccess'

const login = makeLogin({
  credentialsRepo,
  userRepo,
})

const importProjects = makeImportProjects({
  projectRepo,
  appelOffreRepo,
})

const listProjects = makeListProjects({ projectRepo, userRepo })
const listUnnotifiedProjects = makeListUnnotifiedProjects({ projectRepo })

const sendNotification = makeSendNotification({
  notificationRepo,
  sendEmail,
})

const sendCandidateNotification = makeSendCandidateNotification({
  projectRepo,
  projectAdmissionKeyRepo,
  appelOffreRepo,
  sendNotification,
})

const sendAllCandidateNotifications = makeSendAllCandidateNotifiations({
  projectRepo,
  userRepo,
  credentialsRepo,
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

const shouldUserAccessProject = makeShouldUserAccessProject({
  userRepo,
  projectRepo,
})
const getUserProject = makeGetUserProject({
  projectRepo,
  shouldUserAccessProject,
})

const retrievePassword = makeRetrievePassword({
  credentialsRepo,
  passwordRetrievalRepo,
  sendNotification,
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
  sendNotification,
})

const addGarantiesFinancieres = makeAddGarantiesFinancieres({
  projectRepo,
  userRepo,
  projectAdmissionKeyRepo,
  shouldUserAccessProject,
  sendNotification,
})

const inviteDreal = makeInviteDreal({
  credentialsRepo,
  projectAdmissionKeyRepo,
  userRepo,
  sendNotification,
})

const listGarantiesFinancieres = makeListGarantiesFinancieres({
  userRepo,
  projectRepo,
})

const useCases = Object.freeze({
  login,
  importProjects,
  listProjects,
  listUserProjects,
  sendNotification,
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
  addGarantiesFinancieres,
  inviteDreal,
  listGarantiesFinancieres,
})

export default useCases
export {
  login,
  importProjects,
  listProjects,
  listUserProjects,
  sendNotification,
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
  addGarantiesFinancieres,
  inviteDreal,
  listGarantiesFinancieres,
}
