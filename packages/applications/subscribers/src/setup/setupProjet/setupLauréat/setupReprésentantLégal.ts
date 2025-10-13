import {
  HistoriqueProjector,
  ReprésentantLégalProjector,
} from '@potentiel-applications/projectors';
import { ReprésentantLégalNotification } from '@potentiel-applications/notifications';
import { Lauréat } from '@potentiel-domain/projet';

import { createSubscriptionSetup } from '../../createSubscriptionSetup.js';
import { SetupProjet } from '../setup.js';

export const setupReprésentantLégal: SetupProjet = async ({ sendEmail }) => {
  const représentantLégal = createSubscriptionSetup('représentant-légal');

  Lauréat.ReprésentantLégal.ReprésentantLégalSaga.register();

  ReprésentantLégalProjector.register();
  await représentantLégal.setupSubscription<
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

  ReprésentantLégalNotification.register({ sendEmail });
  await représentantLégal.setupSubscription<
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
    messageType: 'System.Notification.Lauréat.ReprésentantLégal',
  });

  await représentantLégal.setupSubscription<
    HistoriqueProjector.SubscriptionEvent,
    HistoriqueProjector.Execute
  >({
    name: 'history',
    eventType: 'all',
    messageType: 'System.Projector.Historique',
  });

  return représentantLégal.clearSubscriptions;
};
