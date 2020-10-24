import makeLogin from './login'
import makeImportProjects from './importProjects'
import makeListProjects from './listProjects'
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
import makeRelanceInvitations from './relanceInvitations'
import makeRelanceGarantiesFinancieres from './relanceGarantiesFinancieres'

import { fileService, sendNotification, eventStore } from '../config'

import {
  credentialsRepo,
  userRepo,
  projectRepo,
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
  eventStore,
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
  findExistingPeriodesForAppelOffre: projectRepo.findExistingPeriodesForAppelOffre,
  findExistingFamillesForAppelOffre: projectRepo.findExistingFamillesForAppelOffre,
  findDrealsForUser: userRepo.findDrealsForUser,
})
const listUnnotifiedProjects = makeListUnnotifiedProjects({
  findAllProjects: projectRepo.findAll,
  findExistingAppelsOffres: projectRepo.findExistingAppelsOffres,
  findExistingPeriodesForAppelOffre: projectRepo.findExistingPeriodesForAppelOffre,
  countUnnotifiedProjects: projectRepo.countUnnotifiedProjects,
  searchAllProjects: projectRepo.searchAll,
  appelOffreRepo,
})

const shouldUserAccessProject = makeShouldUserAccessProject({
  userRepo,
  findProjectById: projectRepo.findById,
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
  eventStore,
  fileService,
  findProjectById: projectRepo.findById,
  saveProject: projectRepo.save,
  findUsersForDreal: userRepo.findUsersForDreal,
  findAllProjectAdmissionKeys: projectAdmissionKeyRepo.findAll,
  shouldUserAccessProject,
  sendNotification,
})
const removeGarantiesFinancieres = makeRemoveGarantiesFinancieres({
  eventStore,
  findProjectById: projectRepo.findById,
  saveProject: projectRepo.save,
  shouldUserAccessProject,
})

const addDCR = makeAddDCR({
  eventStore,
  fileService,
  findProjectById: projectRepo.findById,
  saveProject: projectRepo.save,
  shouldUserAccessProject,
})

const removeDCR = makeRemoveDCR({
  eventStore,
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

const relanceGarantiesFinancieres = makeRelanceGarantiesFinancieres({
  eventStore,
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
  relanceGarantiesFinancieres,
  addDCR,
  removeDCR,
}
