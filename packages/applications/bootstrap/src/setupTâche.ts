import { registerTâcheCommand, registerTâcheQuery, TâcheSaga } from '@potentiel-domain/tache';
import { Event, loadAggregate, subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import { TâcheProjector } from '@potentiel-infrastructure/projectors';
import { mediator } from 'mediateur';
import { TâcheAdapter } from '@potentiel-infrastructure/domain-adapters';
import { listProjection } from '@potentiel-infrastructure/pg-projections';

export const setupTâche = async () => {
  registerTâcheCommand({
    loadAggregate,
  });

  registerTâcheQuery({
    récupérerNombreTâche: TâcheAdapter.récupérerNombreTâcheAdapter,
    list: listProjection,
  });

  TâcheSaga.register();
  TâcheProjector.register();

  const unsubscribeTâcheAbandonSaga = await subscribe<TâcheSaga.SubscriptionEvent & Event>({
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

  const unsubscribeAbandonProjector = await subscribe<TâcheProjector.SubscriptionEvent>({
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
    await unsubscribeAbandonProjector();
  };
};
