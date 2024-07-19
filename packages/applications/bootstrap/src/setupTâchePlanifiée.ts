import { mediator } from 'mediateur';

import { Event, loadAggregate, subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import { TâchePlanifiéeProjector } from '@potentiel-applications/projectors';
import { listProjection } from '@potentiel-infrastructure/pg-projections';
import {
  TâchePlanifiéeGarantiesFinancièresSaga,
  registerTâchePlanifiéeCommand,
  registerTâchePlanifiéeQuery,
} from '@potentiel-domain/tache-planifiee';

export const setupTâchePlanifiée = async () => {
  const unsubscribeTâchePlanifiéeProjector = await registerTâchePlanifiéeProjector();

  const unsubscribeTâchePlanifiéeGarantiesFinancièresSaga =
    await registerTâchePlanifiéeGarantiesFinancièresSaga();

  return async () => {
    await unsubscribeTâchePlanifiéeProjector();
    await unsubscribeTâchePlanifiéeGarantiesFinancièresSaga();
  };
};

const registerTâchePlanifiéeProjector = async () => {
  registerTâchePlanifiéeCommand({
    loadAggregate,
  });

  registerTâchePlanifiéeQuery({
    list: listProjection,
  });
  TâchePlanifiéeProjector.register();

  const unsubscribeTâcheProjector = await subscribe<TâchePlanifiéeProjector.SubscriptionEvent>({
    name: 'projector',
    eventType: ['RebuildTriggered', 'TâchePlanifiéeAjoutée-V1'],
    eventHandler: async (event) => {
      await mediator.send<TâchePlanifiéeProjector.Execute>({
        type: 'System.Projector.TâchePlanifiée',
        data: event,
      });
    },
    streamCategory: 'tâche-planifiée',
  });
  return unsubscribeTâcheProjector;
};

async function registerTâchePlanifiéeGarantiesFinancièresSaga() {
  TâchePlanifiéeGarantiesFinancièresSaga.register();
  const unsubscribeTâcheAbandonSaga = await subscribe<
    TâchePlanifiéeGarantiesFinancièresSaga.SubscriptionEvent & Event
  >({
    name: 'tache-planifiee-saga',
    streamCategory: 'garanties-financieres',
    eventType: ['GarantiesFinancièresModifiées-V1', 'DépôtGarantiesFinancièresEnCoursValidé-V2'],
    eventHandler: async (event) => {
      await mediator.publish<TâchePlanifiéeGarantiesFinancièresSaga.Execute>({
        type: 'System.Saga.TâchePlanifiéeGarantiesFinancières',
        data: event,
      });
    },
  });
  return unsubscribeTâcheAbandonSaga;
}
