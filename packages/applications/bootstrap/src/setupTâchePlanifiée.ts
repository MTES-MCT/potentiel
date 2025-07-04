import { loadAggregate } from '@potentiel-infrastructure/pg-event-sourcing';
import { TâchePlanifiéeProjector } from '@potentiel-applications/projectors';
import { listProjection } from '@potentiel-infrastructure/pg-projection-read';
import {
  registerTâchePlanifiéeUseCases,
  registerTâchePlanifiéeQuery,
} from '@potentiel-domain/tache-planifiee';
import { SendEmail, TâchePlanifiéeNotification } from '@potentiel-applications/notifications';
import { Lauréat } from '@potentiel-domain/projet';

import { createSubscriptionSetup } from './setupProjet/createSubscriptionSetup';

export const setupTâchePlanifiée = async ({ sendEmail }: { sendEmail: SendEmail }) => {
  registerTâchePlanifiéeUseCases({
    loadAggregate,
  });

  registerTâchePlanifiéeQuery({
    list: listProjection,
  });
  const tâchePlanifiée = createSubscriptionSetup('tâche-planifiée');

  TâchePlanifiéeProjector.register();
  await tâchePlanifiée.setupSubscription<
    TâchePlanifiéeProjector.SubscriptionEvent,
    TâchePlanifiéeProjector.Execute
  >({
    name: 'projector',
    eventType: [
      'RebuildTriggered',
      'TâchePlanifiéeAjoutée-V1',
      'TâchePlanifiéeAnnulée-V1',
      'TâchePlanifiéeExecutée-V1',
    ],
    messageType: 'System.Projector.TâchePlanifiée',
  });

  TâchePlanifiéeNotification.register({ sendEmail });
  await tâchePlanifiée.setupSubscription<
    TâchePlanifiéeNotification.SubscriptionEvent,
    TâchePlanifiéeNotification.Execute
  >({
    name: 'notifications',
    eventType: ['TâchePlanifiéeExecutée-V1'],
    messageType: 'System.Notification.TâchePlanifiée',
  });

  await tâchePlanifiée.setupSubscription<
    Lauréat.ReprésentantLégal.ReprésentantLégalSaga.SubscriptionEvent,
    Lauréat.ReprésentantLégal.ReprésentantLégalSaga.Execute
  >({
    name: 'representant-legal-tache-planifiee-saga',
    eventType: ['TâchePlanifiéeExecutée-V1'],
    messageType: 'System.Lauréat.ReprésentantLégal.Saga.Execute',
  });

  return tâchePlanifiée.clearSubscriptions;
};
