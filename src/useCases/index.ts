import makeLogin from './login'
import makeImportProjects from './importProjects'
import makeListProjects from './listProjects'
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
import makeRemoveGarantiesFinancieres from './removeGarantiesFinancieres'
import makeAddDCR from './addDCR'
import makeRemoveDCR from './removeDCR'
import makeInviteDreal from './inviteDreal'
import makeListGarantiesFinancieres from './listGarantiesFinancieres'
import makeSendNotification from './sendNotification'
import makeRelanceInvitations from './relanceInvitations'
import makeRetryNotifications from './retryNotifications'
import makeRelanceGarantiesFinancieres from './relanceGarantiesFinancieres'

import { fileService, eventBus, sendEmail } from '../config'

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
  findOneProject: projectRepo.findOne,
  saveProject: projectRepo.save,
  removeProject: projectRepo.remove,
  addProjectToUserWithEmail: userRepo.addProjectToUserWithEmail,
  appelOffreRepo,
})

const listProjects = makeListProjects({
  searchForRegions: projectRepo.searchForRegions,
  findAllForRegions: projectRepo.findAllForRegions,
  searchForUser: projectRepo.searchForUser,
  findAllForUser: projectRepo.findAllForUser,
  searchAll: projectRepo.searchAll,
  findAll: projectRepo.findAll,
  findExistingAppelsOffres: projectRepo.findExistingAppelsOffres,
  findExistingPeriodesForAppelOffre:
    projectRepo.findExistingPeriodesForAppelOffre,
  findExistingFamillesForAppelOffre:
    projectRepo.findExistingFamillesForAppelOffre,
  findDrealsForUser: userRepo.findDrealsForUser,
})
const listUnnotifiedProjects = makeListUnnotifiedProjects({
  findAllProjects: projectRepo.findAll,
  findExistingAppelsOffres: projectRepo.findExistingAppelsOffres,
  findExistingPeriodesForAppelOffre:
    projectRepo.findExistingPeriodesForAppelOffre,
  countUnnotifiedProjects: projectRepo.countUnnotifiedProjects,
  searchAllProjects: projectRepo.searchAll,
  appelOffreRepo,
})

const sendNotification = makeSendNotification({
  notificationRepo,
  sendEmail,
})
const shouldUserAccessProject = makeShouldUserAccessProject({
  userRepo,
  findProjectById: projectRepo.findById,
})

const sendAllCandidateNotifications = makeSendAllCandidateNotifiations({
  eventBus,
  findAllProjects: projectRepo.findAll,
  saveProject: projectRepo.save,
  projectAdmissionKeyRepo,
  appelOffreRepo,
  sendNotification,
})

const signup = makeSignup({
  userRepo,
  addUserToProjectsWithEmail: userRepo.addUserToProjectsWithEmail,
  addUserToProject: userRepo.addProject,
  credentialsRepo,
  projectAdmissionKeyRepo,
})

const requestModification = makeRequestModification({
  fileService,
  modificationRequestRepo,
  shouldUserAccessProject,
})

const listUserRequests = makeListUserRequests({ modificationRequestRepo })
const listAllRequests = makeListAllRequests({ modificationRequestRepo })

const getUserProject = makeGetUserProject({
  findProjectById: projectRepo.findById,
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
  findProjectById: projectRepo.findById,
  credentialsRepo,
  userRepo,
  projectAdmissionKeyRepo,
  shouldUserAccessProject,
  sendNotification,
})

const addGarantiesFinancieres = makeAddGarantiesFinancieres({
  fileService,
  findProjectById: projectRepo.findById,
  saveProject: projectRepo.save,
  findUsersForDreal: userRepo.findUsersForDreal,
  findAllProjectAdmissionKeys: projectAdmissionKeyRepo.findAll,
  shouldUserAccessProject,
  sendNotification,
})
const removeGarantiesFinancieres = makeRemoveGarantiesFinancieres({
  findProjectById: projectRepo.findById,
  saveProject: projectRepo.save,
  shouldUserAccessProject,
})

const addDCR = makeAddDCR({
  fileService,
  findProjectById: projectRepo.findById,
  saveProject: projectRepo.save,
  shouldUserAccessProject,
})

const removeDCR = makeRemoveDCR({
  findProjectById: projectRepo.findById,
  saveProject: projectRepo.save,
  shouldUserAccessProject,
})

const inviteDreal = makeInviteDreal({
  credentialsRepo,
  projectAdmissionKeyRepo,
  userRepo,
  sendNotification,
})

const listGarantiesFinancieres = makeListGarantiesFinancieres({
  findAllProjectsForRegions: projectRepo.findAllForRegions,
  findAllProjects: projectRepo.findAll,
  findDrealsForUser: userRepo.findDrealsForUser,
})

const relanceInvitations = makeRelanceInvitations({
  projectAdmissionKeyRepo,
  sendNotification,
})

const retryNotifications = makeRetryNotifications({
  notificationRepo,
  sendNotification,
})

const relanceGarantiesFinancieres = makeRelanceGarantiesFinancieres({
  findProjectsWithGarantiesFinancieresPendingBefore:
    projectRepo.findProjectsWithGarantiesFinancieresPendingBefore,
  getUsersForProject: projectRepo.getUsers,
  saveProject: projectRepo.save,
  sendNotification,
})

const useCases = Object.freeze({
  login,
  importProjects,
  listProjects,
  sendNotification,
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
  removeGarantiesFinancieres,
  inviteDreal,
  listGarantiesFinancieres,
  relanceInvitations,
  retryNotifications,
  relanceGarantiesFinancieres,
  addDCR,
  removeDCR,
})

export default useCases
export {
  login,
  importProjects,
  listProjects,
  sendNotification,
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
  removeGarantiesFinancieres,
  inviteDreal,
  listGarantiesFinancieres,
  relanceInvitations,
  retryNotifications,
  relanceGarantiesFinancieres,
  addDCR,
  removeDCR,
}
