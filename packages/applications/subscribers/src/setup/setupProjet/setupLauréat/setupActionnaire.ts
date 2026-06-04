import { ActionnaireNotification } from '@potentiel-applications/notifications';
import { ActionnaireProjector, type HistoriqueProjector } from '@potentiel-applications/projectors';

import { createSubscriptionSetup } from '../../createSubscriptionSetup.js';

export const setupActionnaire = () => {
  const actionnaire = createSubscriptionSetup('actionnaire');

  ActionnaireProjector.register();
  actionnaire.addSubscription<ActionnaireProjector.SubscriptionEvent, ActionnaireProjector.Execute>(
    {
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
    },
  );

  ActionnaireNotification.register();

  actionnaire.addSubscription<
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

  actionnaire.addSubscription<HistoriqueProjector.SubscriptionEvent, HistoriqueProjector.Execute>({
    name: 'history',
    eventType: 'all',
    messageType: 'System.Projector.Historique',
  });

  return actionnaire;
};
