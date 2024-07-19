import { mediator } from 'mediateur';

import {
  TâcheAbandonSaga,
  TâcheGarantiesFinancièresSaga,
  TâcheRaccordementSaga,
  registerTâcheCommand,
  registerTâcheQuery,
} from '@potentiel-domain/tache';
import { Event, loadAggregate, subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import { TâcheProjector, TâchePlanifiéeProjector } from '@potentiel-applications/projectors';
import { récupérerIdentifiantsProjetParEmailPorteurAdapter } from '@potentiel-infrastructure/domain-adapters';
import { countProjection, listProjection } from '@potentiel-infrastructure/pg-projections';
import {
  registerTâchePlanifiéeCommand,
  registerTâchePlanifiéeQuery,
} from '@potentiel-domain/tache-planifiee';

export const setupTâche = async () => {
  const unsubscribeTâcheProjector = await registerTâcheProjector();
  const unsubscribeTâchePlanifiéeProjector = await registerTâchePlanifiéeProjector();

  const unsubscribeTâcheAbandonSaga = await registerTâcheAbandonSaga();
  const unsubscribeTâcheRaccordementSaga = await registerTâcheRaccordementSaga();
  const unsubscribeTâcheGarantiesFinancièresSaga = await registerTâcheGarantiesFinancières();

  return async () => {
    await unsubscribeTâcheAbandonSaga();
    await unsubscribeTâchePlanifiéeProjector();
    await unsubscribeTâcheRaccordementSaga();
    await unsubscribeTâcheGarantiesFinancièresSaga();
    await unsubscribeTâcheProjector();
  };
};

const registerTâcheProjector = async () => {
  registerTâcheCommand({
    loadAggregate,
  });

  registerTâcheQuery({
    count: countProjection,
    récupérerIdentifiantsProjetParEmailPorteur: récupérerIdentifiantsProjetParEmailPorteurAdapter,
    list: listProjection,
  });
  TâcheProjector.register();

  const unsubscribeTâcheProjector = await subscribe<TâcheProjector.SubscriptionEvent>({
    name: 'projector',
    eventType: [
      'RebuildTriggered',
      'TâcheAchevée-V1',
      'TâcheAjoutée-V1',
      'TâcheRelancée-V1',
      'TâcheRenouvellée-V1',
    ],
    eventHandler: async (event) => {
      await mediator.send<TâcheProjector.Execute>({
        type: 'System.Projector.Tâche',
        data: event,
      });
    },
    streamCategory: 'tâche',
  });
  return unsubscribeTâcheProjector;
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

const registerTâcheGarantiesFinancières = async () => {
  TâcheGarantiesFinancièresSaga.register();
  const unsubscribeTâcheGarantiesFinancièresSaga = await subscribe<
    TâcheGarantiesFinancièresSaga.SubscriptionEvent & Event
  >({
    name: 'tache-saga',
    streamCategory: 'garanties-financieres',
    eventType: [
      'GarantiesFinancièresDemandées-V1',
      'DépôtGarantiesFinancièresSoumis-V1',
      'GarantiesFinancièresEnregistrées-V1',
    ],
    eventHandler: async (event) => {
      await mediator.publish<TâcheGarantiesFinancièresSaga.Execute>({
        type: 'System.Saga.TâcheGarantiesFinancières',
        data: event,
      });
    },
  });
  return unsubscribeTâcheGarantiesFinancièresSaga;
};

const registerTâcheRaccordementSaga = async () => {
  TâcheRaccordementSaga.register();
  const unsubscribeTâcheRaccordementSaga = await subscribe<
    TâcheRaccordementSaga.SubscriptionEvent & Event
  >({
    name: 'tache-saga',
    streamCategory: 'raccordement',
    eventType: [
      'RéférenceDossierRacordementModifiée-V1',
      'GestionnaireRéseauRaccordementModifié-V1',
      'GestionnaireRéseauInconnuAttribué-V1',
    ],
    eventHandler: async (event) => {
      await mediator.publish<TâcheRaccordementSaga.Execute>({
        type: 'System.Saga.TâcheRaccordement',
        data: event,
      });
    },
  });
  return unsubscribeTâcheRaccordementSaga;
};

async function registerTâcheAbandonSaga() {
  TâcheAbandonSaga.register();
  const unsubscribeTâcheAbandonSaga = await subscribe<TâcheAbandonSaga.SubscriptionEvent & Event>({
    name: 'tache-saga',
    streamCategory: 'abandon',
    eventType: [
      'AbandonAnnulé-V1',
      'AbandonConfirmé-V1',
      'AbandonRejeté-V1',
      'ConfirmationAbandonDemandée-V1',
      'PreuveRecandidatureDemandée-V1',
      'PreuveRecandidatureTransmise-V1',
    ],
    eventHandler: async (event) => {
      await mediator.publish<TâcheAbandonSaga.Execute>({
        type: 'System.Saga.TâcheAbandon',
        data: event,
      });
    },
  });
  return unsubscribeTâcheAbandonSaga;
}
