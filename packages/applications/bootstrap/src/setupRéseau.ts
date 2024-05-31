import {
  GestionnaireRéseauProjector,
  RaccordementProjector,
} from '@potentiel-applications/projectors';
import { registerRéseauQueries, registerRéseauUseCases } from '@potentiel-domain/reseau';
import { loadAggregate, subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import {
  countProjection,
  findProjection,
  listProjection,
  listProjectionV2,
} from '@potentiel-infrastructure/pg-projections';
import { mediator } from 'mediateur';

export const setupRéseau = async () => {
  registerRéseauUseCases({
    loadAggregate,
  });

  registerRéseauQueries({
    list: listProjection,
    listV2: listProjectionV2,
    find: findProjection,
    count: countProjection,
  });

  GestionnaireRéseauProjector.register();
  RaccordementProjector.register();

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

  const unsubscribeRaccordementProjector = await subscribe<RaccordementProjector.SubscriptionEvent>(
    {
      name: 'projector',
      eventType: [
        'RebuildTriggered',
        'AccuséRéceptionDemandeComplèteRaccordementTransmis-V1',
        'DateMiseEnServiceTransmise-V1',
        'DemandeComplèteDeRaccordementTransmise-V1',
        'DemandeComplèteDeRaccordementTransmise-V2',
        'DemandeComplèteRaccordementModifiée-V1',
        'DemandeComplèteRaccordementModifiée-V2',
        'DemandeComplèteRaccordementModifiée-V3',
        'GestionnaireRéseauRaccordementModifié-V1',
        'PropositionTechniqueEtFinancièreModifiée-V1',
        'PropositionTechniqueEtFinancièreModifiée-V2',
        'PropositionTechniqueEtFinancièreSignéeTransmise-V1',
        'PropositionTechniqueEtFinancièreTransmise-V1',
        'PropositionTechniqueEtFinancièreTransmise-V2',
        'RéférenceDossierRacordementModifiée-V1',
        'GestionnaireRéseauAttribué-V1',
      ],
      eventHandler: async (event) => {
        await mediator.send<RaccordementProjector.Execute>({
          type: 'System.Projector.Réseau.Raccordement',
          data: event,
        });
      },
      streamCategory: 'raccordement',
    },
  );

  return async () => {
    await unsubscribeGestionnaireRéseauProjector();
    await unsubscribeRaccordementProjector();
  };
};
