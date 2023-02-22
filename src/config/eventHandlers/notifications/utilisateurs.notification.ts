import { notificationEventSubscriber } from './notificationEventSubscriber';
import { onUtilisateurInvité } from '@modules/notification';
import { UtilisateurInvité } from '@modules/utilisateur';
import { sendNotification } from '@config/emails.config';

notificationEventSubscriber(
  UtilisateurInvité,
  onUtilisateurInvité({
    sendNotification,
  }),
);
