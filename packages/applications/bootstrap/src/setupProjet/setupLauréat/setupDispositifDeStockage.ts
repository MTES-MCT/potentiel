import {
  HistoriqueProjector,
  DispositifDeStockageProjector,
} from '@potentiel-applications/projectors';
import { DispositifDeStockageNotifications } from '@potentiel-applications/notifications';

import { SetupProjet } from '../setup';
import { createSubscriptionSetup } from '../../createSubscriptionSetup';

export const setupDispositifDeStockage: SetupProjet = async ({ sendEmail }) => {
  const dispositifDeStockage = createSubscriptionSetup('dispositif-de-stockage');

  DispositifDeStockageProjector.register();

  await dispositifDeStockage.setupSubscription<
    DispositifDeStockageProjector.SubscriptionEvent,
    DispositifDeStockageProjector.Execute
  >({
    name: 'projector',
    eventType: [
      'RebuildTriggered',
      'DispositifDeStockageImporté-V1',
      'DispositifDeStockageModifié-V1',
    ],
    messageType: 'System.Projector.Lauréat.DispositifDeStockage',
  });

  DispositifDeStockageNotifications.register({ sendEmail });

  await dispositifDeStockage.setupSubscription<
    DispositifDeStockageNotifications.SubscriptionEvent,
    DispositifDeStockageNotifications.Execute
  >({
    name: 'notifications',
    eventType: ['DispositifDeStockageModifié-V1'],
    messageType: 'System.Notification.Lauréat.DispositifDeStockage',
  });

  await dispositifDeStockage.setupSubscription<
    HistoriqueProjector.SubscriptionEvent,
    HistoriqueProjector.Execute
  >({
    name: 'history',
    eventType: 'all',
    messageType: 'System.Projector.Historique',
  });

  return dispositifDeStockage.clearSubscriptions;
};
