import { AbandonProjector, HistoriqueProjector } from '@potentiel-applications/projectors';
import { AbandonNotification } from '@potentiel-applications/notifications';
import { Lauréat } from '@potentiel-domain/projet';

import { createSubscriptionSetup } from '../../createSubscriptionSetup';
import { SetupProjet } from '../setup';

export const setupAbandon: SetupProjet = async ({ sendEmail }) => {
  const abandon = createSubscriptionSetup('abandon');

  AbandonProjector.register();
  await abandon.setupSubscription<AbandonProjector.SubscriptionEvent, AbandonProjector.Execute>({
    name: 'projector',
    eventType: [
      'AbandonDemandé-V1',
      'AbandonDemandé-V2',
      'AbandonAccordé-V1',
      'AbandonAnnulé-V1',
      'AbandonConfirmé-V1',
      'AbandonPasséEnInstruction-V1',
      'AbandonRejeté-V1',
      'PreuveRecandidatureTransmise-V1',
      'PreuveRecandidatureDemandée-V1',
      'ConfirmationAbandonDemandée-V1',
      'RebuildTriggered',
    ],
    messageType: 'System.Projector.Lauréat.Abandon',
  });

  AbandonNotification.register({ sendEmail });
  await abandon.setupSubscription<
    AbandonNotification.SubscriptionEvent,
    AbandonNotification.Execute
  >({
    name: 'notifications',
    eventType: [
      'AbandonDemandé-V1',
      'AbandonDemandé-V2',
      'AbandonAccordé-V1',
      'AbandonAnnulé-V1',
      'AbandonConfirmé-V1',
      'AbandonRejeté-V1',
      'ConfirmationAbandonDemandée-V1',
      'PreuveRecandidatureDemandée-V1',
      'AbandonPasséEnInstruction-V1',
    ],
    messageType: 'System.Notification.Lauréat.Abandon',
  });

  await abandon.setupSubscription<
    HistoriqueProjector.SubscriptionEvent,
    HistoriqueProjector.Execute
  >({
    name: 'history',
    eventType: 'all',
    messageType: 'System.Projector.Historique',
  });

  await abandon.setupSubscription<
    Lauréat.ReprésentantLégal.ReprésentantLégalSaga.SubscriptionEvent,
    Lauréat.ReprésentantLégal.ReprésentantLégalSaga.Execute
  >({
    name: 'representant-legal-abandon-saga',
    eventType: ['AbandonAccordé-V1'],
    messageType: 'System.Lauréat.ReprésentantLégal.Saga.Execute',
  });

  return abandon.clearSubscriptions;
};
