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
  handleModificationReceived,
  handleModificationRequestCancelled,
  handleModificationRequested,
  handleModificationRequestStatusChanged,
  onCahierDesChargesChoisi,
  makeOnProjectCompletionDueDateSet,
} from '../../modules/notification';
import { CahierDesChargesChoisi, ProjectCompletionDueDateSet } from '../../modules/project';
import { sendNotification } from '../emails.config';
import { eventStore } from '../eventStore.config';
import {
  getModificationRequestInfoForStatusNotification,
  getProjectInfoForModificationReceivedNotification,
  getProjectInfoForModificationRequestedNotification,
  récupérerDonnéesPorteursParProjetQueryHandler,
  getUsersByRole,
} from '../queries.config';
import { getProjectAppelOffre } from '../queryProjectAO.config';
import { oldProjectRepo, oldUserRepo } from '../repos.config';

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
  CahierDesChargesChoisi.type,
  onCahierDesChargesChoisi({
    sendNotification,
    findUserById: oldUserRepo.findById,
    findProjectById: oldProjectRepo.findById,
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

console.log('Notification Event Handlers Initialized');
export const notificationHandlersOk = true;
