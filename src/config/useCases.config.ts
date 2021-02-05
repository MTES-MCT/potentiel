import {
  BaseShouldUserAccessProject,
  makeRevokeRightsToProject,
  makeCancelInvitationToProject,
} from '../modules/authorization'
import { makeLoadFileForUser } from '../modules/file'
import {
  makeCorrectProjectData,
  makeGenerateCertificate,
  makeSubmitPTF,
} from '../modules/project/useCases'
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
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
})

export const cancelInvitationToProject = makeCancelInvitationToProject({
  eventBus: eventStore,
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  getProjectIdForAdmissionKey,
})

export const submitPTF = makeSubmitPTF({
  eventBus: eventStore,
  fileRepo,
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
})
