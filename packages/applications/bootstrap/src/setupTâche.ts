import { mediator } from 'mediateur';

import { Tâche, registerTâcheCommand, registerTâcheQuery } from '@potentiel-domain/tache';
import { Event, loadAggregate, subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import { TâcheProjector } from '@potentiel-applications/projectors';
import { récupérerIdentifiantsProjetParEmailPorteurAdapter } from '@potentiel-infrastructure/domain-adapters';
import { countProjection, listProjection } from '@potentiel-infrastructure/pg-projection-read';

export const setupTâche = async () => {
  const unsubscribeTâcheProjector = await registerTâcheProjector();

  const unsubscribeTâcheAbandonSaga = await registerTâcheAbandonSaga();
  const unsubscribeTâcheRaccordementSaga = await registerTâcheRaccordementSaga();
  const unsubscribeTâcheGarantiesFinancièresSaga = await registerTâcheGarantiesFinancières();

  return async () => {
    await unsubscribeTâcheAbandonSaga();
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

const registerTâcheGarantiesFinancières = async () => {
  Tâche.TâcheGarantiesFinancièresSaga.register();
  const unsubscribeTâcheGarantiesFinancièresSaga = await subscribe<
    Tâche.TâcheGarantiesFinancièresSaga.SubscriptionEvent & Event
  >({
    name: 'tache-saga',
    streamCategory: 'garanties-financieres',
    eventType: [
      'GarantiesFinancièresDemandées-V1',
      'DépôtGarantiesFinancièresSoumis-V1',
      'GarantiesFinancièresEnregistrées-V1',
    ],
    eventHandler: async (event) => {
      await mediator.publish<Tâche.TâcheGarantiesFinancièresSaga.Execute>({
        type: 'System.Saga.TâcheGarantiesFinancières',
        data: event,
      });
    },
  });
  return unsubscribeTâcheGarantiesFinancièresSaga;
};

const registerTâcheRaccordementSaga = async () => {
  Tâche.TâcheRaccordementSaga.register();
  const unsubscribeTâcheRaccordementSaga = await subscribe<
    Tâche.TâcheRaccordementSaga.SubscriptionEvent & Event
  >({
    name: 'tache-saga',
    streamCategory: 'raccordement',
    eventType: [
      'RéférenceDossierRacordementModifiée-V1',
      'RéférenceDossierRacordementModifiée-V2',
      'GestionnaireRéseauRaccordementModifié-V1',
      'GestionnaireRéseauInconnuAttribué-V1',
      'DossierDuRaccordementSupprimé-V1',
      'RaccordementSupprimé-V1',
      'DemandeComplèteRaccordementModifiée-V3',
      'DemandeComplèteDeRaccordementTransmise-V3',
      'GestionnaireRéseauAttribué-V1',
    ],
    eventHandler: async (event) => {
      await mediator.publish<Tâche.TâcheRaccordementSaga.Execute>({
        type: 'System.Saga.TâcheRaccordement',
        data: event,
      });
    },
  });
  return unsubscribeTâcheRaccordementSaga;
};

async function registerTâcheAbandonSaga() {
  Tâche.TâcheAbandonSaga.register();
  const unsubscribeTâcheAbandonSaga = await subscribe<
    Tâche.TâcheAbandonSaga.SubscriptionEvent & Event
  >({
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
      await mediator.publish<Tâche.TâcheAbandonSaga.Execute>({
        type: 'System.Saga.TâcheAbandon',
        data: event,
      });
    },
  });
  return unsubscribeTâcheAbandonSaga;
}
