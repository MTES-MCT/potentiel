import { HistoriqueProjector, RecoursProjector } from '@potentiel-applications/projectors';
import { RecoursNotification } from '@potentiel-applications/notifications';

import { createSubscriptionSetup } from '../../createSubscriptionSetup.js';
import { SetupProjet } from '../setup.js';

export const setupRecours: SetupProjet = async () => {
  const recours = createSubscriptionSetup('recours');

  RecoursProjector.register();
  await recours.setupSubscription<RecoursProjector.SubscriptionEvent, RecoursProjector.Execute>({
    name: 'projector',
    eventType: [
      'RecoursDemandé-V1',
      'RecoursAccordé-V1',
      'RecoursAnnulé-V1',
      'RecoursRejeté-V1',
      'RecoursPasséEnInstruction-V1',
      'RebuildTriggered',
    ],
    messageType: 'System.Projector.Eliminé.Recours',
  });

  RecoursNotification.register();
  await recours.setupSubscription<
    RecoursNotification.SubscriptionEvent,
    RecoursNotification.Execute
  >({
    name: 'notifications',
    eventType: [
      'RecoursDemandé-V1',
      'RecoursAccordé-V1',
      'RecoursAnnulé-V1',
      'RecoursRejeté-V1',
      'RecoursPasséEnInstruction-V1',
    ],
    messageType: 'System.Notification.Eliminé.Recours',
  });

  await recours.setupSubscription<
    HistoriqueProjector.SubscriptionEvent,
    HistoriqueProjector.Execute
  >({
    name: 'history',
    eventType: 'all',
    messageType: 'System.Projector.Historique',
  });

  return recours.clearSubscriptions;
};
