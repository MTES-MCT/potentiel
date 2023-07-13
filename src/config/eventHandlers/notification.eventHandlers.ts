import { UserInvitedToProject } from '@modules/authZ';
import { LegacyCandidateNotified } from '@modules/legacyCandidateNotification';
import {
  ConfirmationRequested,
  ModificationReceived,
  ModificationRequestAccepted,
  ModificationRequestCancelled,
  ModificationRequested,
  ModificationRequestInstructionStarted,
  ModificationRequestRejected,
} from '@modules/modificationRequest';
import {
  handleLegacyCandidateNotified,
  handleModificationReceived,
  handleModificationRequestCancelled,
  handleModificationRequested,
  handleModificationRequestStatusChanged,
  onCahierDesChargesChoisi,
  handleProjectCertificateUpdatedOrRegenerated,
  handleProjectGFSubmitted,
  handleUserInvitedToProject,
  makeOnProjectCompletionDueDateSet,
} from '@modules/notification';
import {
  ProjectCertificateRegenerated,
  ProjectCertificateUpdated,
  ProjectGFSubmitted,
  CahierDesChargesChoisi,
  ProjectCompletionDueDateSet,
} from '@modules/project';
import { sendNotification } from '../emails.config';
import { eventStore } from '../eventStore.config';
import {
  getModificationRequestInfoForStatusNotification,
  getModificationRequestRecipient,
  getProjectInfoForModificationReceivedNotification,
  récupérerDonnéesPorteursParProjetQueryHandler,
} from '../queries.config';
import { oldProjectRepo, oldUserRepo, projectRepo } from '../repos.config';

const projectCertificateChangeHandler = handleProjectCertificateUpdatedOrRegenerated({
  sendNotification,
  projectRepo,
  getUsersForProject: récupérerDonnéesPorteursParProjetQueryHandler,
});

eventStore.subscribe(ProjectCertificateUpdated.type, projectCertificateChangeHandler);
eventStore.subscribe(ProjectCertificateRegenerated.type, projectCertificateChangeHandler);

const modificationRequestStatusChangeHandler = handleModificationRequestStatusChanged({
  sendNotification,
  getModificationRequestInfoForStatusNotification,
});
eventStore.subscribe(
  ModificationRequestInstructionStarted.type,
  modificationRequestStatusChangeHandler,
);
eventStore.subscribe(ModificationRequestAccepted.type, modificationRequestStatusChangeHandler);
eventStore.subscribe(ModificationRequestRejected.type, modificationRequestStatusChangeHandler);
eventStore.subscribe(ConfirmationRequested.type, modificationRequestStatusChangeHandler);
eventStore.subscribe(ModificationRequestCancelled.type, modificationRequestStatusChangeHandler);

eventStore.subscribe(
  ModificationRequested.type,
  handleModificationRequested({
    sendNotification,
    findUsersForDreal: oldUserRepo.findUsersForDreal,
    getModificationRequestInfoForStatusNotification,
  }),
);

eventStore.subscribe(
  ProjectGFSubmitted.type,
  handleProjectGFSubmitted({
    sendNotification,
    findUsersForDreal: oldUserRepo.findUsersForDreal,
    findUserById: oldUserRepo.findById,
    findProjectById: oldProjectRepo.findById,
  }),
);

if (!process.env.DGEC_EMAIL) {
  console.error('ERROR: DGEC_EMAIL is not set');
  process.exit(1);
}

eventStore.subscribe(
  ModificationRequestCancelled.type,
  handleModificationRequestCancelled({
    sendNotification,
    findUsersForDreal: oldUserRepo.findUsersForDreal,
    getModificationRequestInfo: getModificationRequestInfoForStatusNotification,
    getModificationRequestRecipient,
    dgecEmail: process.env.DGEC_EMAIL,
  }),
);

eventStore.subscribe(
  ModificationReceived.type,
  handleModificationReceived({
    sendNotification,
    findUsersForDreal: oldUserRepo.findUsersForDreal,
    getProjectInfoForModificationReceivedNotification,
  }),
);

eventStore.subscribe(
  UserInvitedToProject.type,
  handleUserInvitedToProject({
    sendNotification,
    findUserById: oldUserRepo.findById,
    findProjectById: oldProjectRepo.findById,
  }),
);

eventStore.subscribe(
  CahierDesChargesChoisi.type,
  onCahierDesChargesChoisi({
    sendNotification,
    findUserById: oldUserRepo.findById,
    findProjectById: oldProjectRepo.findById,
  }),
);

eventStore.subscribe(
  LegacyCandidateNotified.type,
  handleLegacyCandidateNotified({
    sendNotification,
  }),
);

eventStore.subscribe(
  ProjectCompletionDueDateSet.type,
  makeOnProjectCompletionDueDateSet({
    sendNotification,
    getProjectUsers: récupérerDonnéesPorteursParProjetQueryHandler,
    getProjectById: oldProjectRepo.findById,
    findUsersForDreal: oldUserRepo.findUsersForDreal,
  }),
);

console.log('Notification Event Handlers Initialized');
export const notificationHandlersOk = true;
