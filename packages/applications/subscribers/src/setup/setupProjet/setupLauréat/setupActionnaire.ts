import { HistoriqueProjector, ActionnaireProjector } from '@potentiel-applications/projectors';
import { ActionnaireNotification } from '@potentiel-applications/notifications';

import { createSubscriptionSetup } from '../../createSubscriptionSetup.js';
import { SetupProjet } from '../setup.js';

export const setupActionnaire: SetupProjet = async () => {
  const actionnaire = createSubscriptionSetup('actionnaire');

  ActionnaireProjector.register();
  await actionnaire.setupSubscription<
    ActionnaireProjector.SubscriptionEvent,
    ActionnaireProjector.Execute
  >({
    name: 'projector',
    eventType: [
      'RebuildTriggered',
      'ActionnaireImporté-V1',
      'ActionnaireModifié-V1',
      'ChangementActionnaireDemandé-V1',
      'ChangementActionnaireAnnulé-V1',
      'ChangementActionnaireSupprimé-V1',
      'ChangementActionnaireEnregistré-V1',
      'ChangementActionnaireAccordé-V1',
      'ChangementActionnaireRejeté-V1',
    ],
    messageType: 'System.Projector.Lauréat.Actionnaire',
  });

  ActionnaireNotification.register();

  await actionnaire.setupSubscription<
    ActionnaireNotification.SubscriptionEvent,
    ActionnaireNotification.Execute
  >({
    name: 'notifications',
    eventType: [
      'ActionnaireModifié-V1',
      'ChangementActionnaireDemandé-V1',
      'ChangementActionnaireAnnulé-V1',
      'ChangementActionnaireSupprimé-V1',
      'ChangementActionnaireAccordé-V1',
      'ChangementActionnaireRejeté-V1',
      'ChangementActionnaireEnregistré-V1',
    ],
    messageType: 'System.Notification.Lauréat.Actionnaire',
  });

  await actionnaire.setupSubscription<
    HistoriqueProjector.SubscriptionEvent,
    HistoriqueProjector.Execute
  >({
    name: 'history',
    eventType: 'all',
    messageType: 'System.Projector.Historique',
  });

  return actionnaire.clearSubscriptions;
};
