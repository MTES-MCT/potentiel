import { makeImportAppelOffreData, makeImportPeriodeData } from '@modules/appelOffre'
import { BaseShouldUserAccessProject, makeRevokeRightsToProject } from '@modules/authZ'
import {
  makeAccorderDemandeDélai,
  makeAnnulerDemandeDélai,
  makeAnnulerRejetDemandeDélai,
  makeDemanderDélai,
  makeRejeterDemandeDélai,
} from '@modules/demandeModification'
import { makeImportEdfData } from '@modules/edf'
import { makeLoadFileForUser } from '@modules/file'
import {
  exceedsPuissanceMaxDuVolumeReserve,
  exceedsRatiosChangementPuissance,
  makeAcceptModificationRequest,
  makeAttachLegacyModificationFile,
  makeCancelModificationRequest,
  makeConfirmRequest,
  makeRejectModificationRequest,
  makeRequestActionnaireModification,
  makeRequestConfirmation,
  makeRequestFournisseursModification,
  makeRequestProducteurModification,
  makeRequestPuissanceModification,
  makeUpdateModificationRequestStatus,
} from '@modules/modificationRequest'
import {
  makeAddGFExpirationDate,
  makeCorrectProjectData,
  makeGenerateCertificate,
  makeImportProjects,
  makeRegenerateCertificatesForPeriode,
  makeRemoveGF,
  makeRemoveStep,
  makeSignalerDemandeAbandon,
  makeSignalerDemandeDelai,
  makeSignalerDemandeRecours,
  makeSubmitGF,
  makeSubmitDCR,
  makeSubmitPTF,
  makeUpdateNewRulesOptIn,
  makeUpdateStepStatus,
  makeUploadGF,
  makeWithdrawGF,
} from '@modules/project'
import { makeClaimProject } from '@modules/projectClaim'
import { makeCreateUser, makeInviteUserToProject, makeRelanceInvitation } from '@modules/users'
import { buildCertificate } from '@views/certificates'
import { makeParseEdfCsv } from '../infra/parseEdfCsv'
import { makeImportEnedisData } from '../modules/enedis'
import { resendInvitationEmail } from './credentials.config'
import { eventStore } from './eventStore.config'
import {
  getAppelOffreList,
  getEDFSearchIndex,
  getEnedisSearchIndex,
  getFileProject,
  getLegacyModificationByFilename,
  getProjectAppelOffreId,
  getProjectDataForProjectClaim,
  getProjectIdsForPeriode,
  getPuissanceProjet,
  getUserByEmail,
  hasProjectGarantieFinanciere,
  isProjectParticipatif,
} from './queries.config'
import {
  appelOffreRepo,
  demandeDélaiRepo,
  fileRepo,
  modificationRequestRepo,
  oldAppelOffreRepo,
  oldProjectRepo,
  oldUserRepo,
  projectClaimRepo,
  projectRepo,
  userRepo,
} from './repos.config'

export const shouldUserAccessProject = new BaseShouldUserAccessProject(
  oldUserRepo,
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

export const submitDCR = makeSubmitDCR({
  fileRepo,
  projectRepo,
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
})

export const submitPTF = makeSubmitPTF({
  fileRepo,
  projectRepo,
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
})

export const submitGF = makeSubmitGF({
  fileRepo,
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  projectRepo,
})

export const uploadGF = makeUploadGF({
  fileRepo,
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  projectRepo,
})

export const addGFExpirationDate = makeAddGFExpirationDate({
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  projectRepo,
})

export const removeStep = makeRemoveStep({
  eventBus: eventStore,
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
})

export const removeGF = makeRemoveGF({
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  projectRepo,
})

export const withdrawGF = makeWithdrawGF({
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  projectRepo,
})

export const updateStepStatus = makeUpdateStepStatus({
  eventBus: eventStore,
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
})

export const requestPuissanceModification = makeRequestPuissanceModification({
  eventBus: eventStore,
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  exceedsRatiosChangementPuissance,
  exceedsPuissanceMaxDuVolumeReserve,
  projectRepo,
  fileRepo,
  getPuissanceProjet,
})

export const requestActionnaireModification = makeRequestActionnaireModification({
  eventBus: eventStore,
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  projectRepo,
  fileRepo,
  isProjectParticipatif,
  hasProjectGarantieFinanciere,
  getProjectAppelOffreId,
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

export const createUser = makeCreateUser({
  userRepo,
})

export const inviteUserToProject = makeInviteUserToProject({
  getUserByEmail,
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  eventBus: eventStore,
  createUser,
})

export const relanceInvitation = makeRelanceInvitation({
  eventBus: eventStore,
  resendInvitationEmail,
})

export const cancelModificationRequest = makeCancelModificationRequest({
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  modificationRequestRepo,
})

export const updateNewRulesOptIn = makeUpdateNewRulesOptIn({
  eventBus: eventStore,
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
})

export const importProjects = makeImportProjects({
  eventBus: eventStore,
  appelOffreRepo: oldAppelOffreRepo,
})

export const claimProject = makeClaimProject({
  projectClaimRepo,
  fileRepo,
  getProjectDataForProjectClaim,
  eventBus: eventStore,
})

export const attachLegacyModificationFile = makeAttachLegacyModificationFile({
  eventBus: eventStore,
  getLegacyModificationByFilename,
  fileRepo,
})

export const signalerDemandeDelai = makeSignalerDemandeDelai({
  fileRepo,
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  projectRepo,
})

export const signalerDemandeAbandon = makeSignalerDemandeAbandon({
  fileRepo,
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  projectRepo,
})

export const signalerDemandeRecours = makeSignalerDemandeRecours({
  fileRepo,
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  projectRepo,
})

export const importEdfData = makeImportEdfData({
  publish: eventStore.publish.bind(eventStore),
  parseCsvFile: makeParseEdfCsv({ fileRepo }),
  getSearchIndex: getEDFSearchIndex,
})

export const importEnedisData = makeImportEnedisData({
  publish: eventStore.publish.bind(eventStore),
  parseCsvFile: makeParseEdfCsv({ fileRepo }),
  getSearchIndex: getEnedisSearchIndex,
})

export const demanderDélai = makeDemanderDélai({
  fileRepo,
  appelOffreRepo: oldAppelOffreRepo,
  publishToEventStore: eventStore.publish.bind(eventStore),
  getProjectAppelOffreId,
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  projectRepo,
})

export const annulerDemandeDélai = makeAnnulerDemandeDélai({
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  demandeDélaiRepo,
  publishToEventStore: eventStore.publish.bind(eventStore),
})

export const rejeterDemandeDélai = makeRejeterDemandeDélai({
  fileRepo,
  demandeDélaiRepo,
  publishToEventStore: eventStore.publish.bind(eventStore),
})

export const accorderDemandeDélai = makeAccorderDemandeDélai({
  fileRepo,
  demandeDélaiRepo,
  publishToEventStore: eventStore.publish.bind(eventStore),
  projectRepo,
})

export const annulerRejetDemandeDélai = makeAnnulerRejetDemandeDélai({
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  demandeDélaiRepo,
  publishToEventStore: eventStore.publish.bind(eventStore),
})
