import { notificationEventSubscriber } from './notificationEventSubscriber';
import { AnnulationAbandonAccordée, AnnulationAbandonRejetée } from '@modules/demandeModification';
import {
  makeOnAnnulationAbandonAccordée,
  makeOnAnnulationAbandonRejetée,
} from '@modules/notification';
import { getModificationRequestInfoForStatusNotification } from '../../queries.config';
import { notifierPorteurChangementStatutDemande } from '@config/useCases.config';

if (!process.env.DGEC_EMAIL) {
  console.error('ERROR: DGEC_EMAIL is not set');
  process.exit(1);
}

notificationEventSubscriber(
  AnnulationAbandonAccordée,
  makeOnAnnulationAbandonAccordée({
    notifierPorteurChangementStatutDemande,
    getModificationRequestInfoForStatusNotification,
  }),
);

notificationEventSubscriber(
  AnnulationAbandonRejetée,
  makeOnAnnulationAbandonRejetée({
    notifierPorteurChangementStatutDemande,
    getModificationRequestInfoForStatusNotification,
  }),
);
