import { fromOldResultAsync } from '../core/utils'
import { User } from '../entities'
import { makeImportAppelOffreData, makeImportPeriodeData } from '../modules/appelOffre/useCases'
import {
  BaseShouldUserAccessProject,
  makeCancelInvitationToProject,
  makeRevokeRightsToProject,
} from '../modules/authorization'
import { makeLoadFileForUser } from '../modules/file'
import {
  makeAcceptModificationRequest,
  makeCancelModificationRequest,
  makeConfirmRequest,
  makeRejectModificationRequest,
  makeRequestActionnaireModification,
  makeRequestConfirmation,
  makeRequestProducteurModification,
  makeRequestPuissanceModification,
  makeUpdateModificationRequestStatus,
} from '../modules/modificationRequest'
import { getAutoAcceptRatiosForAppelOffre } from '../modules/modificationRequest/helpers'
import { makeRequestFournisseursModification } from '../modules/modificationRequest/useCases/requestFournisseursModification'
import {
  makeCorrectProjectData,
  makeGenerateCertificate,
  makeRegenerateCertificatesForPeriode,
  makeRemoveStep,
  makeSubmitStep,
  makeUpdateStepStatus,
} from '../modules/project/useCases'
import { InfraNotAvailableError } from '../modules/shared'
import { makeCreateUser, makeInviteUser, makeInviteUserToProject } from '../modules/users'
import { buildCertificate } from '../views/certificates'
import { createUserCredentials } from './credentials.config'
import { sendNotification } from './emails.config'
import { eventStore } from './eventStore.config'
import {
  getAppelOffreList,
  getFileProject,
  getProjectIdForAdmissionKey,
  getProjectIdsForPeriode,
  getUserByEmail,
} from './queries.config'
import {
  appelOffreRepo,
  fileRepo,
  modificationRequestRepo,
  oldProjectRepo,
  projectAdmissionKeyRepo,
  projectRepo,
  userRepo,
} from './repos.config'

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
export const rejectModificationRequest = makeRejectModificationRequest({
  fileRepo,
  modificationRequestRepo,
})
export const requestConfirmation = makeRequestConfirmation({
  fileRepo,
  modificationRequestRepo,
})
export const updateModificationRequestStatus = makeUpdateModificationRequestStatus({
  modificationRequestRepo,
})

export const confirmRequest = makeConfirmRequest({
  modificationRequestRepo,
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
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

export const submitStep = makeSubmitStep({
  eventBus: eventStore,
  fileRepo,
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
})

export const removeStep = makeRemoveStep({
  eventBus: eventStore,
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
})

export const updateStepStatus = makeUpdateStepStatus({
  eventBus: eventStore,
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
})

export const requestPuissanceModification = makeRequestPuissanceModification({
  eventBus: eventStore,
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  getAutoAcceptRatiosForAppelOffre,
  projectRepo,
  fileRepo,
})

export const requestActionnaireModification = makeRequestActionnaireModification({
  eventBus: eventStore,
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  projectRepo,
  fileRepo,
})

export const requestProducteurModification = makeRequestProducteurModification({
  eventBus: eventStore,
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  projectRepo,
  fileRepo,
})

export const requestFournisseurModification = makeRequestFournisseursModification({
  eventBus: eventStore,
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  projectRepo,
  fileRepo,
})

export const regenerateCertificatesForPeriode = makeRegenerateCertificatesForPeriode({
  eventBus: eventStore,
  generateCertificate,
  projectRepo,
  getProjectIdsForPeriode,
})

export const importAppelOffreData = makeImportAppelOffreData({
  eventBus: eventStore,
  appelOffreRepo,
  getAppelOffreList,
})

export const importPeriodeData = makeImportPeriodeData({
  eventBus: eventStore,
  appelOffreRepo,
})

const saveUser = (user: User) => {
  return fromOldResultAsync(userRepo.insert(user))
    .map(() => null)
    .mapErr(() => new InfraNotAvailableError())
}

const createUser = makeCreateUser({
  getUserByEmail,
  createUserCredentials,
  saveUser,
})

export const inviteUser = makeInviteUser({
  projectAdmissionKeyRepo,
  getUserByEmail,
  sendNotification,
})

const addProjectToUser = (args: { userId: string; projectId: string }) => {
  const { userId, projectId } = args
  return fromOldResultAsync(userRepo.addProject(userId, projectId)).mapErr(
    () => new InfraNotAvailableError()
  )
}

export const inviteUserToProject = makeInviteUserToProject({
  getUserByEmail,
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  addProjectToUser,
  createUser,
})

export const cancelModificationRequest = makeCancelModificationRequest({
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  modificationRequestRepo,
})
