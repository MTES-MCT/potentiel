import { RecoursNotification } from '@potentiel-applications/notifications';
import { RecoursProjector, ÉliminéProjector } from '@potentiel-applications/projectors';

import { createSubscriptionSetup } from './createSubscriptionSetup';
import { SetupProjet } from './setup';

export const setupÉliminé: SetupProjet = async ({ sendEmail }) => {
  const éliminé = createSubscriptionSetup('éliminé');

  ÉliminéProjector.register();
  await éliminé.setupSubscription<ÉliminéProjector.SubscriptionEvent, ÉliminéProjector.Execute>({
    name: 'projector',
    eventType: ['ÉliminéNotifié-V1', 'ÉliminéArchivé-V1', 'RebuildTriggered'],
    messageType: 'System.Projector.Eliminé',
  });

  const recours = createSubscriptionSetup('éliminé');

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

  RecoursNotification.register({ sendEmail });
  await recours.setupSubscription<
    RecoursNotification.SubscriptionEvent,
    RecoursNotification.Execute
  >({
    name: 'notifications',
    eventType: ['RecoursDemandé-V1', 'RecoursAnnulé-V1', 'RecoursAccordé-V1', 'RecoursRejeté-V1'],
    messageType: 'System.Notification.Eliminé.Recours',
  });

  return async () => {
    await éliminé.clearListeners();
    await recours.clearListeners();
  };
};
