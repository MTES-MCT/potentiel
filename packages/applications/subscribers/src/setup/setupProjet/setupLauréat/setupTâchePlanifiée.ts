import { TâchePlanifiéeProjector } from '@potentiel-applications/projectors';
import { SendEmail, TâchePlanifiéeNotification } from '@potentiel-applications/notifications';
import { Lauréat } from '@potentiel-domain/projet';

import { createSubscriptionSetup } from '../../createSubscriptionSetup.js';

export const setupTâchePlanifiée = async ({ sendEmail }: { sendEmail: SendEmail }) => {
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

  await tâchePlanifiée.setupSubscription<
    Lauréat.GarantiesFinancières.GarantiesFinancièresSaga.SubscriptionEvent,
    Lauréat.GarantiesFinancières.GarantiesFinancièresSaga.Execute
  >({
    name: 'garanties-financieres-tache-planifiee-saga',
    eventType: ['TâchePlanifiéeExecutée-V1'],
    messageType: 'System.Lauréat.GarantiesFinancières.Saga.Execute',
  });

  return tâchePlanifiée.clearSubscriptions;
};
