import {
  makeAccorderDemandeDélai,
  makeAnnulerDemandeDélai,
  makeAnnulerRejetDélai,
  makeDemanderDélai,
  makeRejeterDemandeDélai,
  makePasserDemandeDélaiEnInstruction,
  makeCorrigerDélaiAccordé,
} from '../modules/demandeModification/demandeDélai';

import { makeLoadFileForUser } from '../modules/file';
import {
  makeAcceptModificationRequest,
  makeCancelModificationRequest,
  makeConfirmRequest,
  makeRejectModificationRequest,
  makeRequestConfirmation,
} from '../modules/modificationRequest';
import { makeSignalerDemandeDelai } from '../modules/project';
import { makeCreateUser } from '../modules/users';
import { eventStore } from './eventStore.config';
import { getFileProject, getProjectAppelOffreId } from './queries.config';
import {
  demandeDélaiRepo,
  fileRepo,
  modificationRequestRepo,
  oldAppelOffreRepo,
  projectRepo,
  userRepo,
} from './repos.config';
import { sendNotification } from './emails.config';
import { makeNotifierPorteurChangementStatutDemande } from '../modules/notification';
import makeShouldUserAccessProject from '../useCases/shouldUserAccessProject';

const publishToEventStore = eventStore.publish.bind(eventStore);

export const shouldUserAccessProject = makeShouldUserAccessProject();

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

export const createUser = makeCreateUser({
  userRepo,
});

export const cancelModificationRequest = makeCancelModificationRequest({
  shouldUserAccessProject: shouldUserAccessProject.check.bind(shouldUserAccessProject),
  modificationRequestRepo,
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

export const notifierPorteurChangementStatutDemande = makeNotifierPorteurChangementStatutDemande({
  sendNotification,
});
