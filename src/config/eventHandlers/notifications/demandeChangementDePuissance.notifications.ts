import { notificationEventSubscriber } from './notificationEventSubscriber';
import { RejetChangementDePuissanceAnnulé } from '@modules/demandeModification';
import { makeOnRejetChangementDePuissanceAnnulé } from '@modules/notification';
import { notifierPorteurChangementStatutDemande } from '@config/useCases.config';
import { getModificationRequestInfoForStatusNotification } from '../../queries.config';

notificationEventSubscriber(
  RejetChangementDePuissanceAnnulé,
  makeOnRejetChangementDePuissanceAnnulé({
    notifierPorteurChangementStatutDemande,
    getModificationRequestInfoForStatusNotification,
  }),
);
