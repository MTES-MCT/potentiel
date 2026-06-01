import { TâchePlanifiéeNotification } from '@potentiel-applications/notifications';
import { TâchePlanifiéeProjector } from '@potentiel-applications/projectors';
import type { Lauréat } from '@potentiel-domain/projet';

import { createSubscriptionSetup } from '../../createSubscriptionSetup.js';

export const setupTâchePlanifiée = () => {
  const tâchePlanifiée = createSubscriptionSetup('tâche-planifiée');

  TâchePlanifiéeProjector.register();
  tâchePlanifiée.addSubscription<
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

  TâchePlanifiéeNotification.register();
  tâchePlanifiée.addSubscription<
    TâchePlanifiéeNotification.SubscriptionEvent,
    TâchePlanifiéeNotification.Execute
  >({
    name: 'notifications',
    eventType: ['TâchePlanifiéeExecutée-V1'],
    messageType: 'System.Notification.TâchePlanifiée',
  });

  tâchePlanifiée.addSubscription<
    Lauréat.ReprésentantLégal.ReprésentantLégalSaga.SubscriptionEvent,
    Lauréat.ReprésentantLégal.ReprésentantLégalSaga.Execute
  >({
    name: 'representant-legal-tache-planifiee-saga',
    eventType: ['TâchePlanifiéeExecutée-V1'],
    messageType: 'System.Lauréat.ReprésentantLégal.Saga.Execute',
  });

  tâchePlanifiée.addSubscription<
    Lauréat.GarantiesFinancières.GarantiesFinancièresSaga.SubscriptionEvent,
    Lauréat.GarantiesFinancières.GarantiesFinancièresSaga.Execute
  >({
    name: 'garanties-financieres-tache-planifiee-saga',
    eventType: ['TâchePlanifiéeExecutée-V1'],
    messageType: 'System.Lauréat.GarantiesFinancières.Saga.Execute',
  });

  tâchePlanifiée.addSubscription<
    Lauréat.Raccordement.RaccordementSaga.SubscriptionEvent,
    Lauréat.Raccordement.RaccordementSaga.Execute
  >({
    name: 'raccordement-tache-planifiee-saga',
    eventType: ['TâchePlanifiéeExecutée-V1'],
    messageType: 'System.Lauréat.Raccordement.Saga.Execute',
  });

  return tâchePlanifiée;
};
