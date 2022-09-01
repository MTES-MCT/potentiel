import { makeImportAppelOffreData, makeImportPeriodeData } from '@modules/appelOffre'
import { BaseShouldUserAccessProject, makeRevokeRightsToProject } from '@modules/authZ'
import {
  makeAccorderDemandeDélai,
  makeAnnulerDemandeDélai,
  makeAnnulerRejetDélai,
  makeDemanderDélai,
  makeRejeterDemandeDélai,
  makePasserDemandeDélaiEnInstruction,
} from '@modules/demandeModification/demandeDélai'
import {
  makeDemanderAbandon,
  makeAnnulerDemandeAbandon,
  makeAccorderDemandeAbandon,
  makeRejeterDemandeAbandon,
  makeDemanderConfirmationAbandon,
  makeConfirmerDemandeAbandon,
  makeAnnulerRejetAbandon,
} from '@modules/demandeModification/demandeAbandon'
import { makeAnnulerRejetRecours } from '@modules/demandeModification/demandeRecours'
import { makeAnnulerRejetChangementDePuissance } from '@modules/demandeModification/demandeChangementDePuissance'
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
  makeChangerProducteur,
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
  makeSubmitDCR,
  makeSubmitGF,
  makeSubmitPTF,
  makeChoisirNouveauCahierDesCharges,
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
  getUserById,
  hasProjectGarantieFinanciere,
  isProjectParticipatif,
} from './queries.config'
import {
  appelOffreRepo,
  demandeAbandonRepo,
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
import { sendNotification } from '@config/emails.config'
import { makeNotifierPorteurChangementStatutDemande } from '../modules/notification'

export const shouldUserAccessProject = new BaseShouldUserAccessProject(
  oldUserRepo,
  oldProjectRepo.findById
)

export const generateCertificate = makeGenerateCertificate({
  fileRepo,
  projectRepo,
  buildCertificate,
  getUserById,
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

export const changerProducteur = makeChangerProducteur({
  eventBus: eventStore,
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  projectRepo,
  fileRepo,
  findAppelOffreById: oldAppelOffreRepo.findById,
  getUserByEmail,
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

export const choisirNouveauCahierDesCharges = makeChoisirNouveauCahierDesCharges({
  eventBus: eventStore,
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  projectRepo,
  findAppelOffreById: oldAppelOffreRepo.findById,
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
  findAppelOffreById: oldAppelOffreRepo.findById,
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

export const annulerRejetDélai = makeAnnulerRejetDélai({
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  demandeDélaiRepo,
  publishToEventStore: eventStore.publish.bind(eventStore),
})

export const passerDemandeDélaiEnInstruction = makePasserDemandeDélaiEnInstruction({
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  demandeDélaiRepo,
  publishToEventStore: eventStore.publish.bind(eventStore),
})

export const annulerRejetRecours = makeAnnulerRejetRecours({
  modificationRequestRepo,
  publishToEventStore: eventStore.publish.bind(eventStore),
})

export const annulerRejetChangementDePuissance = makeAnnulerRejetChangementDePuissance({
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  modificationRequestRepo,
  publishToEventStore: eventStore.publish.bind(eventStore),
})

export const demanderAbandon = makeDemanderAbandon({
  fileRepo,
  findAppelOffreById: oldAppelOffreRepo.findById,
  publishToEventStore: eventStore.publish.bind(eventStore),
  getProjectAppelOffreId,
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  projectRepo,
})

export const annulerDemandeAbandon = makeAnnulerDemandeAbandon({
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  demandeAbandonRepo,
  publishToEventStore: eventStore.publish.bind(eventStore),
})

export const accorderDemandeAbandon = makeAccorderDemandeAbandon({
  fileRepo,
  demandeAbandonRepo,
  publishToEventStore: eventStore.publish.bind(eventStore),
})

export const demanderConfirmationAbandon = makeDemanderConfirmationAbandon({
  fileRepo,
  demandeAbandonRepo,
  publishToEventStore: eventStore.publish.bind(eventStore),
})

export const confirmerDemandeAbandon = makeConfirmerDemandeAbandon({
  demandeAbandonRepo,
  aAccèsAuProjet: oldUserRepo.hasProject,
  publishToEventStore: eventStore.publish.bind(eventStore),
})

export const rejeterDemandeAbandon = makeRejeterDemandeAbandon({
  fileRepo,
  demandeAbandonRepo,
  publishToEventStore: eventStore.publish.bind(eventStore),
})

export const annulerRejetAbandon = makeAnnulerRejetAbandon({
  demandeAbandonRepo,
  publishToEventStore: eventStore.publish.bind(eventStore),
})

export const notifierPorteurChangementStatutDemande = makeNotifierPorteurChangementStatutDemande({
  sendNotification,
})
