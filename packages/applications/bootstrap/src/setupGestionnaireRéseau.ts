import { registerRéseauQueries, registerRéseauUseCases } from '@potentiel-domain/reseau';
import { loadAggregate, subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import { listProjection } from '@potentiel-infrastructure/pg-projections';
import { GestionnaireRéseauProjector } from '@potentiel-infrastructure/projectors';
import { mediator } from 'mediateur';

export const setupGestionnaireRéseau = async () => {
  registerRéseauUseCases({
    loadAggregate,
  });

  registerRéseauQueries({
    list: listProjection,
  });

  GestionnaireRéseauProjector.register();

  const unsubscribeGestionnaireRéseauProjector =
    await subscribe<GestionnaireRéseauProjector.SubscriptionEvent>({
      name: 'projector',
      eventType: [
        'RebuildTriggered',
        'GestionnaireRéseauAjouté-V1',
        'GestionnaireRéseauModifié-V1',
      ],
      eventHandler: async (event) => {
        await mediator.send<GestionnaireRéseauProjector.Execute>({
          type: 'EXECUTE_GESTIONNAIRE_RÉSEAU_PROJECTOR',
          data: event,
        });
      },
      streamCategory: 'gestionnaire-réseau',
    });

  return async () => {
    await unsubscribeGestionnaireRéseauProjector();
  };
};
