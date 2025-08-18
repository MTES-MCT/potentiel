import { makeLoadFileForUser } from '../modules/file';
import {
  makeAcceptModificationRequest,
  makeCancelModificationRequest,
  makeConfirmRequest,
  makeRejectModificationRequest,
  makeRequestConfirmation,
} from '../modules/modificationRequest';
import { makeCreateUser } from '../modules/users';
import { eventStore } from './eventStore.config';
import { getFileProject, getProjectAppelOffreId } from './queries.config';
import {
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

export const notifierPorteurChangementStatutDemande = makeNotifierPorteurChangementStatutDemande({
  sendNotification,
});
