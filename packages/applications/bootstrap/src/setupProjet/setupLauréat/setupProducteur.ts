import { ProducteurProjector } from '@potentiel-applications/projectors';
import { ProducteurNotification } from '@potentiel-applications/notifications';

import { createSubscriptionSetup } from '../createSubscriptionSetup';
import { SetupProjet } from '../setup';

export const setupProducteur: SetupProjet = async ({ sendEmail }) => {
  const producteur = createSubscriptionSetup('producteur');

  ProducteurProjector.register();
  await producteur.setupSubscription<
    ProducteurProjector.SubscriptionEvent,
    ProducteurProjector.Execute
  >({
    name: 'projector',
    eventType: [
      'RebuildTriggered',
      'ProducteurImporté-V1',
      'ProducteurModifié-V1',
      'ChangementProducteurEnregistré-V1',
    ],
    messageType: 'System.Projector.Lauréat.Producteur',
  });

  ProducteurNotification.register({ sendEmail });
  await producteur.setupSubscription<
    ProducteurNotification.SubscriptionEvent,
    ProducteurNotification.Execute
  >({
    name: 'notifications',
    eventType: ['ProducteurModifié-V1', 'ChangementProducteurEnregistré-V1'],
    messageType: 'System.Notification.Lauréat.Producteur',
  });

  return producteur.clearListeners;
};
