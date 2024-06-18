import { registerTâcheCommand, registerTâcheQuery, TâcheSaga } from '@potentiel-domain/tache';
import { Event, loadAggregate, subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import { TâcheProjector } from '@potentiel-applications/projectors';
import { mediator } from 'mediateur';
import { récupérerIdentifiantsProjetParEmailPorteurAdapter } from '@potentiel-infrastructure/domain-adapters';
import { countProjection, listProjection } from '@potentiel-infrastructure/pg-projections';

export const setupTâche = async () => {
  registerTâcheCommand({
    loadAggregate,
  });

  registerTâcheQuery({
    count: countProjection,
    récupérerIdentifiantsProjetParEmailPorteur: récupérerIdentifiantsProjetParEmailPorteurAdapter,
    list: listProjection,
  });

  TâcheSaga.register();
  TâcheProjector.register();

  const unsubscribeTâcheAbandonSaga = await subscribe<TâcheSaga.AbandonSubscriptionEvent & Event>({
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
      await mediator.publish<TâcheSaga.Execute>({
        type: 'System.Saga.Tâche',
        data: event,
      });
    },
  });

  const unsubscribeTâcheRaccordementSaga = await subscribe<
    TâcheSaga.RaccordementSubscriptionEvent & Event
  >({
    name: 'tache-saga',
    streamCategory: 'raccordement',
    eventType: ['RéférenceDossierRacordementModifiée-V1'],
    eventHandler: async (event) => {
      await mediator.publish<TâcheSaga.Execute>({
        type: 'System.Saga.Tâche',
        data: event,
      });
    },
  });

  const unsubscribeTâcheGarantiesFinancièresSaga = await subscribe<
    TâcheSaga.GarantiesFinancièresSubscriptionEvent & Event
  >({
    name: 'tache-saga',
    streamCategory: 'garanties-financieres',
    eventType: [
      'GarantiesFinancièresDemandées-V1',
      'DépôtGarantiesFinancièresSoumis-V1',
      'GarantiesFinancièresEnregistrées-V1',
    ],
    eventHandler: async (event) => {
      await mediator.publish<TâcheSaga.Execute>({
        type: 'System.Saga.Tâche',
        data: event,
      });
    },
  });

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

  return async () => {
    await unsubscribeTâcheAbandonSaga();
    await unsubscribeTâcheRaccordementSaga();
    await unsubscribeTâcheGarantiesFinancièresSaga();
    await unsubscribeTâcheProjector();
  };
};
