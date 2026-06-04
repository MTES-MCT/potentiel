import { AbandonNotification } from '@potentiel-applications/notifications';
import { AbandonProjector, type HistoriqueProjector } from '@potentiel-applications/projectors';
import type { Lauréat } from '@potentiel-domain/projet';

import { createSubscriptionSetup } from '../../createSubscriptionSetup.js';

export const setupAbandon = () => {
  const abandon = createSubscriptionSetup('abandon');

  AbandonProjector.register();
  abandon.addSubscription<AbandonProjector.SubscriptionEvent, AbandonProjector.Execute>({
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

  AbandonNotification.register();
  abandon.addSubscription<AbandonNotification.SubscriptionEvent, AbandonNotification.Execute>({
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

  abandon.addSubscription<HistoriqueProjector.SubscriptionEvent, HistoriqueProjector.Execute>({
    name: 'history',
    eventType: 'all',
    messageType: 'System.Projector.Historique',
  });

  abandon.addSubscription<
    Lauréat.ReprésentantLégal.ReprésentantLégalSaga.SubscriptionEvent,
    Lauréat.ReprésentantLégal.ReprésentantLégalSaga.Execute
  >({
    name: 'representant-legal-abandon-saga',
    eventType: ['AbandonAccordé-V1'],
    messageType: 'System.Lauréat.ReprésentantLégal.Saga.Execute',
  });

  return abandon;
};
