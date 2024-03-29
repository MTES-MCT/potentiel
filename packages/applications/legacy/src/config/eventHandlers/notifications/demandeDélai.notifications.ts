import { notificationEventSubscriber } from './notificationEventSubscriber';
import {
  DélaiAccordé,
  DélaiAccordéCorrigé,
  DélaiAnnulé,
  DélaiDemandé,
  DélaiEnInstruction,
  DélaiRejeté,
  RejetDélaiAnnulé,
} from '../../../modules/demandeModification';
import {
  makeOnDélaiAccordé,
  makeOnDélaiAccordéCorrigé,
  makeOnDélaiAnnulé,
  makeOnDélaiDemandé,
  makeOnDélaiRejeté,
  makeOnRejetDélaiAnnulé,
  makeOnDélaiEnInstruction,
} from '../../../modules/notification';
import { sendNotification } from '../../emails.config';
import {
  getModificationRequestInfoForStatusNotification,
  getProjectInfoForModificationRequestedNotification,
} from '../../queries.config';
import { oldUserRepo } from '../../repos.config';

if (!process.env.DGEC_EMAIL) {
  console.error('ERROR: DGEC_EMAIL is not set');
  process.exit(1);
}

notificationEventSubscriber(
  DélaiDemandé,
  makeOnDélaiDemandé({
    sendNotification,
    findUsersForDreal: oldUserRepo.findUsersForDreal,
    getProjectInfoForModificationRequestedNotification,
    dgecEmail: process.env.DGEC_EMAIL,
  }),
);
notificationEventSubscriber(
  DélaiAccordé,
  makeOnDélaiAccordé({
    sendNotification,
    getModificationRequestInfoForStatusNotification,
  }),
);

notificationEventSubscriber(
  DélaiAccordéCorrigé,
  makeOnDélaiAccordéCorrigé({
    sendNotification,
    getModificationRequestInfoForStatusNotification,
  }),
);

notificationEventSubscriber(
  DélaiRejeté,
  makeOnDélaiRejeté({
    sendNotification,
    getModificationRequestInfoForStatusNotification,
  }),
);

notificationEventSubscriber(
  RejetDélaiAnnulé,
  makeOnRejetDélaiAnnulé({
    sendNotification,
    getModificationRequestInfoForStatusNotification,
  }),
);

notificationEventSubscriber(
  DélaiAnnulé,
  makeOnDélaiAnnulé({
    sendNotification,
    getModificationRequestInfoForStatusNotification,
    findUsersForDreal: oldUserRepo.findUsersForDreal,
    dgecEmail: process.env.DGEC_EMAIL,
  }),
);

notificationEventSubscriber(
  DélaiEnInstruction,
  makeOnDélaiEnInstruction({
    sendNotification,
    getModificationRequestInfoForStatusNotification,
  }),
);
