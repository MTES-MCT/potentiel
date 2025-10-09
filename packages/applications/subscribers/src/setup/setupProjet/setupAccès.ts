import { AccèsProjector } from '@potentiel-applications/projectors';
import { AccèsNotification } from '@potentiel-applications/notifications';

import { createSubscriptionSetup } from '../createSubscriptionSetup';

import { SetupProjet } from './setup';

export const setupAccès: SetupProjet = async ({ sendEmail }) => {
  const accès = createSubscriptionSetup('accès');

  AccèsProjector.register();
  await accès.setupSubscription<AccèsProjector.SubscriptionEvent, AccèsProjector.Execute>({
    name: 'projector',
    eventType: ['RebuildTriggered', 'AccèsProjetAutorisé-V1', 'AccèsProjetRetiré-V1'],
    messageType: 'System.Projector.Accès',
  });

  AccèsNotification.register({ sendEmail });
  await accès.setupSubscription<AccèsNotification.SubscriptionEvent, AccèsNotification.Execute>({
    name: 'notifications',
    eventType: ['AccèsProjetRetiré-V1'],
    messageType: 'System.Notification.Accès',
  });

  return accès.clearSubscriptions;
};
