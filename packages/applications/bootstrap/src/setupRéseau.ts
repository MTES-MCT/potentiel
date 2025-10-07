import { mediator } from 'mediateur';

import { GestionnaireRéseauProjector } from '@potentiel-applications/projectors';
import { registerRéseauQueries, registerRéseauUseCases } from '@potentiel-domain/reseau';
import { loadAggregateV2, subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projection-read';

export const setupRéseau = async () => {
  registerRéseauUseCases({
    loadAggregate: loadAggregateV2,
  });

  registerRéseauQueries({
    list: listProjection,
    find: findProjection,
  });

  // TODO move to Subscribers

  // Projectors
  GestionnaireRéseauProjector.register();

  const unsubscribeGestionnaireRéseauProjector =
    await subscribe<GestionnaireRéseauProjector.SubscriptionEvent>({
      name: 'projector',
      eventType: [
        'RebuildTriggered',
        'GestionnaireRéseauAjouté-V1',
        'GestionnaireRéseauModifié-V1',
        'GestionnaireRéseauAjouté-V2',
        'GestionnaireRéseauModifié-V2',
      ],
      eventHandler: async (event) => {
        await mediator.send<GestionnaireRéseauProjector.Execute>({
          type: 'System.Projector.Réseau.Gestionnaire',
          data: event,
        });
      },
      streamCategory: 'gestionnaire-réseau',
    });

  return async () => {
    await unsubscribeGestionnaireRéseauProjector();
  };
};
