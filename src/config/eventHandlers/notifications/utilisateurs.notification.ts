import { notificationEventSubscriber } from './notificationEventSubscriber';
import { onUtilisateurInvité } from '../../../modules/notification';
import { UtilisateurInvité } from '../../../modules/utilisateur';
import { sendNotification } from "../../emails.config";

notificationEventSubscriber(
  UtilisateurInvité,
  onUtilisateurInvité({
    sendNotification,
  }),
);
