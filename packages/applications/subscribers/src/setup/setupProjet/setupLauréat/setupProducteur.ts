import { ProducteurNotification } from '@potentiel-applications/notifications';
import { type HistoriqueProjector, ProducteurProjector } from '@potentiel-applications/projectors';

import { createSubscriptionSetup } from '../../createSubscriptionSetup.js';

export const setupProducteur = () => {
  const producteur = createSubscriptionSetup('producteur');

  ProducteurProjector.register();
  producteur.addSubscription<ProducteurProjector.SubscriptionEvent, ProducteurProjector.Execute>({
    name: 'projector',
    eventType: [
      'RebuildTriggered',
      'ProducteurImporté-V1',
      'ProducteurModifié-V1',
      'ChangementProducteurEnregistré-V1',
    ],
    messageType: 'System.Projector.Lauréat.Producteur',
  });

  ProducteurNotification.register();
  producteur.addSubscription<
    ProducteurNotification.SubscriptionEvent,
    ProducteurNotification.Execute
  >({
    name: 'notifications',
    eventType: ['ProducteurModifié-V1', 'ChangementProducteurEnregistré-V1'],
    messageType: 'System.Notification.Lauréat.Producteur',
  });

  producteur.addSubscription<HistoriqueProjector.SubscriptionEvent, HistoriqueProjector.Execute>({
    name: 'history',
    eventType: 'all',
    messageType: 'System.Projector.Historique',
  });

  return producteur;
};
