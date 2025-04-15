import { BaseShouldUserAccessProject } from '../modules/authZ';
import {
  makeAccorderDemandeDélai,
  makeAnnulerDemandeDélai,
  makeAnnulerRejetDélai,
  makeDemanderDélai,
  makeRejeterDemandeDélai,
  makePasserDemandeDélaiEnInstruction,
  makeCorrigerDélaiAccordé,
} from '../modules/demandeModification/demandeDélai';
import { makeAnnulerRejetRecours } from '../modules/demandeModification/demandeRecours';
import {
  makeAnnulerRejetChangementDePuissance,
  makeDemanderChangementDePuissance,
  exceedsPuissanceMaxDuVolumeReserve,
  exceedsRatiosChangementPuissance,
  exceedsPuissanceMaxFamille,
} from '../modules/demandeModification/demandeChangementDePuissance';
import { makeLoadFileForUser } from '../modules/file';
import {
  makeAcceptModificationRequest,
  makeCancelModificationRequest,
  makeConfirmRequest,
  makeRejectModificationRequest,
  makeRequestConfirmation,
  makeRequestFournisseursModification,
  makeChangerProducteur,
} from '../modules/modificationRequest';
import {
  makeImportProjects,
  makeSignalerDemandeDelai,
  makeChoisirCahierDesCharges,
} from '../modules/project';
import { makeClaimProject } from '../modules/projectClaim';
import { makeCreateUser } from '../modules/users';
import { eventStore } from './eventStore.config';
import {
  getFileProject,
  getLegacyModificationByFilename,
  getProjectAppelOffreId,
  getProjectDataForProjectClaim,
  getPuissanceProjet,
} from './queries.config';
import {
  demandeDélaiRepo,
  fileRepo,
  modificationRequestRepo,
  oldAppelOffreRepo,
  oldProjectRepo,
  oldUserRepo,
  projectClaimRepo,
  projectRepo,
  userRepo,
} from './repos.config';
import { sendNotification } from './emails.config';
import { makeNotifierPorteurChangementStatutDemande } from '../modules/notification';

import { getProjectAppelOffre } from './queryProjectAO.config';

const publishToEventStore = eventStore.publish.bind(eventStore);

export const shouldUserAccessProject = new BaseShouldUserAccessProject(
  oldUserRepo,
  oldProjectRepo.findById,
);

export const loadFileForUser = makeLoadFileForUser({
  fileRepo,
  shouldUserAccessProject,
  getFileProject,
});

export const acceptModificationRequest = makeAcceptModificationRequest({
  fileRepo,
  projectRepo,
  modificationRequestRepo,
});
export const rejectModificationRequest = makeRejectModificationRequest({
  fileRepo,
  modificationRequestRepo,
});
export const requestConfirmation = makeRequestConfirmation({
  fileRepo,
  modificationRequestRepo,
});

export const confirmRequest = makeConfirmRequest({
  modificationRequestRepo,
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
});

export const demanderChangementDePuissance = makeDemanderChangementDePuissance({
  eventBus: eventStore,
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  exceedsRatiosChangementPuissance,
  exceedsPuissanceMaxDuVolumeReserve,
  exceedsPuissanceMaxFamille,
  projectRepo,
  fileRepo,
  getPuissanceProjet,
  getProjectAppelOffre,
});

export const changerProducteur = makeChangerProducteur({
  eventBus: eventStore,
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  projectRepo,
  fileRepo,
  findAppelOffreById: oldAppelOffreRepo.findById,
});

export const requestFournisseurModification = makeRequestFournisseursModification({
  eventBus: eventStore,
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  projectRepo,
  fileRepo,
});

export const createUser = makeCreateUser({
  userRepo,
});

export const cancelModificationRequest = makeCancelModificationRequest({
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  modificationRequestRepo,
});

export const choisirCahierDesCharges = makeChoisirCahierDesCharges({
  publishToEventStore,
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  projectRepo,
  findAppelOffreById: oldAppelOffreRepo.findById,
});

export const importProjects = makeImportProjects({
  eventBus: eventStore,
  appelOffreRepo: oldAppelOffreRepo,
});

export const claimProject = makeClaimProject({
  projectClaimRepo,
  fileRepo,
  getProjectDataForProjectClaim,
  eventBus: eventStore,
});

export const signalerDemandeDelai = makeSignalerDemandeDelai({
  fileRepo,
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  projectRepo,
});

export const demanderDélai = makeDemanderDélai({
  fileRepo,
  findAppelOffreById: oldAppelOffreRepo.findById,
  publishToEventStore,
  getProjectAppelOffreId,
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  projectRepo,
});

export const annulerDemandeDélai = makeAnnulerDemandeDélai({
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  demandeDélaiRepo,
  publishToEventStore,
});

export const rejeterDemandeDélai = makeRejeterDemandeDélai({
  fileRepo,
  demandeDélaiRepo,
  publishToEventStore,
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
});

export const accorderDemandeDélai = makeAccorderDemandeDélai({
  fileRepo,
  demandeDélaiRepo,
  publishToEventStore,
  projectRepo,
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
});

export const corrigerDélaiAccordé = makeCorrigerDélaiAccordé({
  fileRepo,
  demandeDélaiRepo,
  publishToEventStore,
  projectRepo,
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
});

export const annulerRejetDélai = makeAnnulerRejetDélai({
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  demandeDélaiRepo,
  publishToEventStore,
});

export const passerDemandeDélaiEnInstruction = makePasserDemandeDélaiEnInstruction({
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  demandeDélaiRepo,
  publishToEventStore,
});

export const annulerRejetRecours = makeAnnulerRejetRecours({
  modificationRequestRepo,
  publishToEventStore,
});

export const annulerRejetChangementDePuissance = makeAnnulerRejetChangementDePuissance({
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  modificationRequestRepo,
  publishToEventStore,
});

export const notifierPorteurChangementStatutDemande = makeNotifierPorteurChangementStatutDemande({
  sendNotification,
});
