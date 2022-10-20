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
  makeChoisirCahierDesCharges,
  makeUpdateStepStatus,
  makeUploadGF,
  makeWithdrawGF,
  makeRenseignerIdentifiantGestionnaireRéseau,
} from '@modules/project'
import { makeClaimProject } from '@modules/projectClaim'
import { makeCreateUser, makeInviteUserToProject, makeRelanceInvitation } from '@modules/users'
import { buildCertificate } from '@views/certificates'
import { makeParseEdfCsv } from '@infra/parseEdfCsv'
import { makeImportEnedisData } from '@modules/enedis'
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
  trouverProjetsParIdentifiantGestionnaireRéseau,
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
  importRepo,
} from './repos.config'
import { sendNotification } from '@config/emails.config'
import {
  makeNotifierPorteurChangementStatutDemande,
  makeNotifierPorteurRévocationAccèsProjet,
} from '@modules/notification'

import { makeDémarrerImportGestionnaireRéseau } from '@modules/imports/gestionnaireRéseau'

const publishToEventStore = eventStore.publish.bind(eventStore)

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

export const choisirCahierDesCharges = makeChoisirCahierDesCharges({
  publishToEventStore,
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  projectRepo,
  findAppelOffreById: oldAppelOffreRepo.findById,
})

export const renseignerIdentifiantGestionnaireRéseau = makeRenseignerIdentifiantGestionnaireRéseau({
  publishToEventStore,
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  projectRepo,
  trouverProjetsParIdentifiantGestionnaireRéseau,
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
  publish: publishToEventStore,
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
  publishToEventStore,
  getProjectAppelOffreId,
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  projectRepo,
})

export const annulerDemandeDélai = makeAnnulerDemandeDélai({
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  demandeDélaiRepo,
  publishToEventStore,
})

export const rejeterDemandeDélai = makeRejeterDemandeDélai({
  fileRepo,
  demandeDélaiRepo,
  publishToEventStore,
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
})

export const accorderDemandeDélai = makeAccorderDemandeDélai({
  fileRepo,
  demandeDélaiRepo,
  publishToEventStore,
  projectRepo,
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
})

export const annulerRejetDélai = makeAnnulerRejetDélai({
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  demandeDélaiRepo,
  publishToEventStore,
})

export const passerDemandeDélaiEnInstruction = makePasserDemandeDélaiEnInstruction({
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  demandeDélaiRepo,
  publishToEventStore,
})

export const annulerRejetRecours = makeAnnulerRejetRecours({
  modificationRequestRepo,
  publishToEventStore,
})

export const annulerRejetChangementDePuissance = makeAnnulerRejetChangementDePuissance({
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  modificationRequestRepo,
  publishToEventStore,
})

export const demanderAbandon = makeDemanderAbandon({
  fileRepo,
  findAppelOffreById: oldAppelOffreRepo.findById,
  publishToEventStore,
  getProjectAppelOffreId,
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  projectRepo,
})

export const annulerDemandeAbandon = makeAnnulerDemandeAbandon({
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  demandeAbandonRepo,
  publishToEventStore,
})

export const accorderDemandeAbandon = makeAccorderDemandeAbandon({
  fileRepo,
  demandeAbandonRepo,
  publishToEventStore,
})

export const demanderConfirmationAbandon = makeDemanderConfirmationAbandon({
  fileRepo,
  demandeAbandonRepo,
  publishToEventStore,
})

export const confirmerDemandeAbandon = makeConfirmerDemandeAbandon({
  demandeAbandonRepo,
  aAccèsAuProjet: oldUserRepo.hasProject,
  publishToEventStore,
})

export const rejeterDemandeAbandon = makeRejeterDemandeAbandon({
  fileRepo,
  demandeAbandonRepo,
  publishToEventStore,
})

export const annulerRejetAbandon = makeAnnulerRejetAbandon({
  demandeAbandonRepo,
  publishToEventStore,
})

export const notifierPorteurChangementStatutDemande = makeNotifierPorteurChangementStatutDemande({
  sendNotification,
})

export const notifierPorteurRévocationAccèsProjet = makeNotifierPorteurRévocationAccèsProjet({
  sendNotification,
})

export const démarrerImportGestionnaireRéseau = makeDémarrerImportGestionnaireRéseau({
  importRepo,
  publishToEventStore,
})
