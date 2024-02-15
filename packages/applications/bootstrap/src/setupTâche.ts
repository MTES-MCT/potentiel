import { registerTâcheCommand, registerTâcheQuery, TâcheSaga } from '@potentiel-domain/tache';
import { Event, loadAggregate, subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import { TâcheProjector } from '@potentiel-infrastructure/projectors';
import { mediator } from 'mediateur';
import { TâcheAdapter } from '@potentiel-infrastructure/domain-adapters';

export const setupTâche = async () => {
  registerTâcheCommand({
    loadAggregate,
  });

  registerTâcheQuery({
    récupérerNombreTâche: TâcheAdapter.récupérerNombreTâcheAdapter,
    récupérerTâches: TâcheAdapter.récupérerTâchesAdapter,
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
        type: 'EXECUTE_TÂCHE_SAGA',
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
        type: 'EXECUTE_TÂCHE_SAGA',
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
        type: 'EXECUTE_TÂCHE_PROJECTOR',
        data: event,
      });
    },
    streamCategory: 'tâche',
  });

  return async () => {
    await unsubscribeTâcheAbandonSaga();
    await unsubscribeTâcheRaccordementSaga();
    await unsubscribeTâcheProjector();
  };
};
