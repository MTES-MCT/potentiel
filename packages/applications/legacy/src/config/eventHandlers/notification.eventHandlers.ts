import { UserInvitedToProject } from '../../modules/authZ';
import { LegacyCandidateNotified } from '../../modules/legacyCandidateNotification';
import {
  ConfirmationRequested,
  ModificationReceived,
  ModificationRequestAccepted,
  ModificationRequestCancelled,
  ModificationRequested,
  ModificationRequestInstructionStarted,
  ModificationRequestRejected,
} from '../../modules/modificationRequest';
import {
  handleLegacyCandidateNotified,
  handleModificationReceived,
  handleModificationRequestCancelled,
  handleModificationRequested,
  handleModificationRequestStatusChanged,
  onCahierDesChargesChoisi,
  handleProjectCertificateUpdatedOrRegenerated,
  handleUserInvitedToProject,
  makeOnProjectCompletionDueDateSet,
  makeOnPeriodeNotified,
} from '../../modules/notification';
import {
  ProjectCertificateRegenerated,
  ProjectCertificateUpdated,
  CahierDesChargesChoisi,
  ProjectCompletionDueDateSet,
  PeriodeNotified,
} from '../../modules/project';
import { sendNotification } from '../emails.config';
import { eventStore } from '../eventStore.config';
import {
  getModificationRequestInfoForStatusNotification,
  getProjectInfoForModificationReceivedNotification,
  getProjectInfoForModificationRequestedNotification,
  getRecipientsForPeriodeNotifiedNotification,
  récupérerDonnéesPorteursParProjetQueryHandler,
  getUsersByRole,
} from '../queries.config';
import { getProjectAppelOffre } from '../queryProjectAO.config';
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
  getUsersByRole,
});
eventStore.subscribe(
  ModificationRequestInstructionStarted.type,
  modificationRequestStatusChangeHandler,
);
eventStore.subscribe(ModificationRequestAccepted.type, modificationRequestStatusChangeHandler);
eventStore.subscribe(ModificationRequestRejected.type, modificationRequestStatusChangeHandler);
eventStore.subscribe(ConfirmationRequested.type, modificationRequestStatusChangeHandler);
eventStore.subscribe(ModificationRequestCancelled.type, modificationRequestStatusChangeHandler);

if (!process.env.DGEC_EMAIL) {
  console.error('ERROR: DGEC_EMAIL is not set');
  process.exit(1);
}

eventStore.subscribe(
  ModificationRequested.type,
  handleModificationRequested({
    sendNotification,
    findUsersForDreal: oldUserRepo.findUsersForDreal,
    getProjectInfoForModificationRequestedNotification,
    dgecEmail: process.env.DGEC_EMAIL,
  }),
);

eventStore.subscribe(
  ModificationRequestCancelled.type,
  handleModificationRequestCancelled({
    sendNotification,
    findUsersForDreal: oldUserRepo.findUsersForDreal,
    getModificationRequestInfoForStatusNotification,
    dgecEmail: process.env.DGEC_EMAIL,
  }),
);

eventStore.subscribe(
  ModificationReceived.type,
  handleModificationReceived({
    sendNotification,
    findUsersForDreal: oldUserRepo.findUsersForDreal,
    getProjectInfoForModificationReceivedNotification,
    getProjectAppelOffres: getProjectAppelOffre,
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
    dgecEmail: process.env.DGEC_EMAIL,
  }),
);

eventStore.subscribe(
  PeriodeNotified.type,
  makeOnPeriodeNotified({ sendNotification, getRecipientsForPeriodeNotifiedNotification }),
);

console.log('Notification Event Handlers Initialized');
export const notificationHandlersOk = true;
