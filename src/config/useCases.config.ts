import {
  BaseShouldUserAccessProject,
  makeRevokeRightsToProject,
  makeCancelInvitationToProject,
} from '../modules/authorization'
import { makeLoadFileForUser } from '../modules/file'
import { makeCorrectProjectData, makeGenerateCertificate } from '../modules/project/useCases'
import { buildCertificate } from '../views/certificates'
import {
  fileRepo,
  oldProjectRepo,
  projectRepo,
  userRepo,
  modificationRequestRepo,
} from './repos.config'
import { getFileProject, getProjectIdForAdmissionKey } from './queries.config'
import { eventStore } from './eventStore.config'
import { makeAcceptModificationRequest } from '../modules/modificationRequest'

export const shouldUserAccessProject = new BaseShouldUserAccessProject(
  userRepo,
  oldProjectRepo.findById
)

export const generateCertificate = makeGenerateCertificate({
  fileRepo,
  projectRepo,
  buildCertificate,
})

export const correctProjectData = makeCorrectProjectData({
  fileRepo,
  projectRepo,
  generateCertificate,
})

export const loadFileForUser = makeLoadFileForUser({
  fileRepo,
  shouldUserAccessProject,
  getFileProject,
})

export const acceptModificationRequest = makeAcceptModificationRequest({
  fileRepo,
  projectRepo,
  modificationRequestRepo,
})

export const revokeUserRightsToProject = makeRevokeRightsToProject({
  eventBus: eventStore,
  shouldUserAccessProject: shouldUserAccessProject.check,
})

export const cancelInvitationToProject = makeCancelInvitationToProject({
  eventBus: eventStore,
  shouldUserAccessProject: shouldUserAccessProject.check,
  getProjectIdForAdmissionKey,
})
