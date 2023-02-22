import { notificationEventSubscriber } from './notificationEventSubscriber';
import { RejetRecoursAnnulé } from '@modules/demandeModification';
import { makeOnRejetRecoursAnnulé } from '@modules/notification';
import { sendNotification } from '../../emails.config';
import { getModificationRequestInfoForStatusNotification } from '../../queries.config';

notificationEventSubscriber(
  RejetRecoursAnnulé,
  makeOnRejetRecoursAnnulé({
    sendNotification,
    getModificationRequestInfoForStatusNotification,
  }),
);
