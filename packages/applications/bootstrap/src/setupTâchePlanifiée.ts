import { mediator } from 'mediateur';

import { Event, loadAggregate, subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import { TâchePlanifiéeProjector } from '@potentiel-applications/projectors';
import { listProjection } from '@potentiel-infrastructure/pg-projections';
import {
  TâchePlanifiéeAchévementSaga,
  TâchePlanifiéeGarantiesFinancièresSaga,
  registerTâchePlanifiéeUseCases,
  registerTâchePlanifiéeQuery,
} from '@potentiel-domain/tache-planifiee';

export const setupTâchePlanifiée = async () => {
  const unsubscribeTâchePlanifiéeProjector = await registerTâchePlanifiéeProjector();

  const unsubscribeTâchePlanifiéeGarantiesFinancièresSaga =
    await registerTâchePlanifiéeGarantiesFinancièresSaga();
  const unsubscribeTâchePlanifiéeAchévementSaga = await registerTâchePlanifiéeAchévementSaga();

  return async () => {
    await unsubscribeTâchePlanifiéeProjector();
    await unsubscribeTâchePlanifiéeGarantiesFinancièresSaga();
    await unsubscribeTâchePlanifiéeAchévementSaga();
  };
};

const registerTâchePlanifiéeProjector = async () => {
  registerTâchePlanifiéeUseCases({
    loadAggregate,
  });

  registerTâchePlanifiéeQuery({
    list: listProjection,
  });
  TâchePlanifiéeProjector.register();

  const unsubscribeTâcheProjector = await subscribe<TâchePlanifiéeProjector.SubscriptionEvent>({
    name: 'projector',
    eventType: [
      'RebuildTriggered',
      'TâchePlanifiéeAjoutée-V1',
      'TâchePlanifiéeAnnulée-V1',
      'TâchePlanifiéeExecutée-V1',
    ],
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
  const unsubscribeTâchePlanifiéeGarantiesFinancièresSaga = await subscribe<
    TâchePlanifiéeGarantiesFinancièresSaga.SubscriptionEvent & Event
  >({
    name: 'tache-planifiee-saga',
    streamCategory: 'garanties-financieres',
    eventType: [
      'DépôtGarantiesFinancièresSoumis-V1',
      'GarantiesFinancièresModifiées-V1',
      'GarantiesFinancièresEnregistrées-V1',
      'DépôtGarantiesFinancièresEnCoursValidé-V2',
      'TypeGarantiesFinancièresImporté-V1',
    ],
    eventHandler: async (event) => {
      await mediator.publish<TâchePlanifiéeGarantiesFinancièresSaga.Execute>({
        type: 'System.Saga.TâchePlanifiéeGarantiesFinancières',
        data: event,
      });
    },
  });
  return unsubscribeTâchePlanifiéeGarantiesFinancièresSaga;
}

async function registerTâchePlanifiéeAchévementSaga() {
  TâchePlanifiéeAchévementSaga.register();
  const unsubscribeTâchePlanifiéeAchèvementSaga = await subscribe<
    TâchePlanifiéeAchévementSaga.SubscriptionEvent & Event
  >({
    name: 'tache-planifiee-saga',
    streamCategory: 'achevement',
    eventType: ['AttestationConformitéTransmise-V1'],
    eventHandler: async (event) => {
      await mediator.publish<TâchePlanifiéeAchévementSaga.Execute>({
        type: 'System.Saga.TâchePlanifiéeAchèvement',
        data: event,
      });
    },
  });
  return unsubscribeTâchePlanifiéeAchèvementSaga;
}
