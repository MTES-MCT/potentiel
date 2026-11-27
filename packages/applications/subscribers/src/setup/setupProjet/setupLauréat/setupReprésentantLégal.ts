import { ReprésentantLégalNotification } from '@potentiel-applications/notifications-email';
import {
  type HistoriqueProjector,
  ReprésentantLégalProjector,
} from '@potentiel-applications/projectors';
import type { NotificationApplication } from '@potentiel-domain/notifications-application';
import { Lauréat } from '@potentiel-domain/projet';

import { createSubscriptionSetup } from '../../createSubscriptionSetup.js';

export const setupReprésentantLégal = () => {
  const représentantLégal = createSubscriptionSetup('représentant-légal');

  Lauréat.ReprésentantLégal.ReprésentantLégalSaga.register();

  ReprésentantLégalProjector.register();
  représentantLégal.addSubscription<
    ReprésentantLégalProjector.SubscriptionEvent,
    ReprésentantLégalProjector.Execute
  >({
    name: 'projector',
    eventType: [
      'RebuildTriggered',
      'ReprésentantLégalImporté-V1',
      'ReprésentantLégalModifié-V1',
      'ChangementReprésentantLégalDemandé-V1',
      'ChangementReprésentantLégalAnnulé-V1',
      'ChangementReprésentantLégalCorrigé-V1',
      'ChangementReprésentantLégalAccordé-V1',
      'ChangementReprésentantLégalRejeté-V1',
      'ChangementReprésentantLégalSupprimé-V1',
      'ChangementReprésentantLégalEnregistré-V1',
    ],
    messageType: 'System.Projector.Lauréat.ReprésentantLégal',
  });

  ReprésentantLégalNotification.register();
  représentantLégal.addSubscription<
    ReprésentantLégalNotification.SubscriptionEvent,
    ReprésentantLégalNotification.Execute
  >({
    name: 'notifications',
    eventType: [
      'ReprésentantLégalModifié-V1',
      'ChangementReprésentantLégalDemandé-V1',
      'ChangementReprésentantLégalAnnulé-V1',
      'ChangementReprésentantLégalCorrigé-V1',
      'ChangementReprésentantLégalAccordé-V1',
      'ChangementReprésentantLégalRejeté-V1',
      'ChangementReprésentantLégalEnregistré-V1',
    ],
    messageType: 'System.NotificationEmail.Lauréat.ReprésentantLégal',
  });

  représentantLégal.addSubscription<
    NotificationApplication.Saga.SubscriptionEvent,
    NotificationApplication.Saga.Execute
  >({
    name: 'notification-application-saga',
    eventType: ['ChangementReprésentantLégalEnregistré-V1'],
    messageType: 'System.NotificationApplication.Saga.Execute',
  });

  représentantLégal.addSubscription<
    HistoriqueProjector.SubscriptionEvent,
    HistoriqueProjector.Execute
  >({
    name: 'history',
    eventType: 'all',
    messageType: 'System.Projector.Historique',
  });

  return représentantLégal;
};
