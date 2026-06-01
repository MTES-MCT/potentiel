import { PuissanceNotification } from '@potentiel-applications/notifications';
import { type HistoriqueProjector, PuissanceProjector } from '@potentiel-applications/projectors';

import { createSubscriptionSetup } from '../../createSubscriptionSetup.js';

export const setupPuissance = () => {
  const puissance = createSubscriptionSetup('puissance');

  PuissanceProjector.register();
  puissance.addSubscription<PuissanceProjector.SubscriptionEvent, PuissanceProjector.Execute>({
    name: 'projector',
    eventType: [
      'RebuildTriggered',
      'PuissanceImportée-V1',
      'PuissanceModifiée-V1',
      'ChangementPuissanceDemandé-V1',
      'ChangementPuissanceAnnulé-V1',
      'ChangementPuissanceSupprimé-V1',
      'ChangementPuissanceEnregistré-V1',
      'ChangementPuissanceAccordé-V1',
      'ChangementPuissanceRejeté-V1',
    ],
    messageType: 'System.Projector.Lauréat.Puissance',
  });

  PuissanceNotification.register();
  puissance.addSubscription<PuissanceNotification.SubscriptionEvent, PuissanceNotification.Execute>(
    {
      name: 'notifications',
      eventType: [
        'PuissanceModifiée-V1',
        'ChangementPuissanceDemandé-V1',
        'ChangementPuissanceAnnulé-V1',
        'ChangementPuissanceSupprimé-V1',
        'ChangementPuissanceAccordé-V1',
        'ChangementPuissanceRejeté-V1',
        'ChangementPuissanceEnregistré-V1',
      ],
      messageType: 'System.Notification.Lauréat.Puissance',
    },
  );

  puissance.addSubscription<HistoriqueProjector.SubscriptionEvent, HistoriqueProjector.Execute>({
    name: 'history',
    eventType: 'all',
    messageType: 'System.Projector.Historique',
  });

  return puissance;
};
