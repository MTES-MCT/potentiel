import { RecoursNotification } from '@potentiel-applications/notifications';
import { type HistoriqueProjector, RecoursProjector } from '@potentiel-applications/projectors';

import { createSubscriptionSetup } from '../../createSubscriptionSetup.js';

export const setupRecours = () => {
  const recours = createSubscriptionSetup('recours');

  RecoursProjector.register();
  recours.addSubscription<RecoursProjector.SubscriptionEvent, RecoursProjector.Execute>({
    name: 'projector',
    eventType: [
      'RecoursDemandé-V1',
      'RecoursAccordé-V1',
      'RecoursAccordé-V2',
      'RecoursAnnulé-V1',
      'RecoursRejeté-V1',
      'RecoursPasséEnInstruction-V1',
      'RebuildTriggered',
    ],
    messageType: 'System.Projector.Eliminé.Recours',
  });

  RecoursNotification.register();
  recours.addSubscription<RecoursNotification.SubscriptionEvent, RecoursNotification.Execute>({
    name: 'notifications',
    eventType: [
      'RecoursDemandé-V1',
      'RecoursAccordé-V2',
      'RecoursAnnulé-V1',
      'RecoursRejeté-V1',
      'RecoursPasséEnInstruction-V1',
    ],
    messageType: 'System.Notification.Eliminé.Recours',
  });

  recours.addSubscription<HistoriqueProjector.SubscriptionEvent, HistoriqueProjector.Execute>({
    name: 'history',
    eventType: 'all',
    messageType: 'System.Projector.Historique',
  });

  return recours;
};
