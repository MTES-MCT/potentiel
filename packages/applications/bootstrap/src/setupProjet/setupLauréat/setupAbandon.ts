import { AbandonProjector } from '@potentiel-applications/projectors';
import { AbandonNotification } from '@potentiel-applications/notifications';
import { Lauréat } from '@potentiel-domain/projet';

import { createSubscriptionSetup } from '../createSubscriptionSetup';
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
    ],
    messageType: 'System.Notification.Lauréat.Abandon',
  });

  // Saga Abandon => Puissance
  Lauréat.Puissance.PuissanceSaga.register();
  await abandon.setupSubscription<
    Lauréat.Puissance.PuissanceSaga.SubscriptionEvent,
    Lauréat.Puissance.PuissanceSaga.Execute
  >({
    name: 'puissance-abandon-saga',
    eventType: ['AbandonAccordé-V1'],
    messageType: 'System.Lauréat.Puissance.Saga.Execute',
  });

  return abandon.clearListeners;
};
