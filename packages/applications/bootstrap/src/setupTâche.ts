import { mediator } from 'mediateur';

import { registerTâcheCommand, registerTâcheQuery } from '@potentiel-domain/tache';
import { loadAggregate, subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import { TâcheProjector } from '@potentiel-applications/projectors';
import { récupérerIdentifiantsProjetParEmailPorteurAdapter } from '@potentiel-infrastructure/domain-adapters';
import { countProjection, listProjection } from '@potentiel-infrastructure/pg-projections';

export const setupTâche = async () => {
  const unsubscribeTâcheProjector = await registerTâcheProjector();

  return async () => {
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
