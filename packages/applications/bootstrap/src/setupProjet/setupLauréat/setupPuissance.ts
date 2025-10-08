import { HistoriqueProjector, PuissanceProjector } from '@potentiel-applications/projectors';
import { PuissanceNotification } from '@potentiel-applications/notifications';

import { createSubscriptionSetup } from '../../createSubscriptionSetup';
import { SetupProjet } from '../setup';

export const setupPuissance: SetupProjet = async ({ sendEmail }) => {
  const puissance = createSubscriptionSetup('puissance');

  PuissanceProjector.register();
  await puissance.setupSubscription<
    PuissanceProjector.SubscriptionEvent,
    PuissanceProjector.Execute
  >({
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

  PuissanceNotification.register({ sendEmail });
  await puissance.setupSubscription<
    PuissanceNotification.SubscriptionEvent,
    PuissanceNotification.Execute
  >({
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
  });

  await puissance.setupSubscription<
    HistoriqueProjector.SubscriptionEvent,
    HistoriqueProjector.Execute
  >({
    name: 'history',
    eventType: 'all',
    messageType: 'System.Projector.Historique',
  });

  return puissance.clearSubscriptions;
};
