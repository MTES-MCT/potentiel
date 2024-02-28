import { registerTâcheCommand, registerTâcheQuery } from '@potentiel-domain/tache';
import { loadAggregate, subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
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

  return async () => {
    await unsubscribeTâcheProjector();
  };
};
