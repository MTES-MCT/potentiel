import { mediator } from 'mediateur';

import {
  GestionnaireRéseauProjector,
  RaccordementProjector,
} from '@potentiel-applications/projectors';
import {
  Raccordement,
  registerRéseauQueries,
  registerRéseauUseCases,
} from '@potentiel-domain/reseau';
import { Event, loadAggregate, subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import {
  countProjection,
  findProjection,
  listProjection,
} from '@potentiel-infrastructure/pg-projections';

type SetupRéseauDependencies = {
  récupérerGRDParVille: Raccordement.RécupererGRDParVillePort;
};
export const setupRéseau = async ({ récupérerGRDParVille }: SetupRéseauDependencies) => {
  registerRéseauUseCases({
    loadAggregate,
  });

  registerRéseauQueries({
    list: listProjection,
    find: findProjection,
    count: countProjection,
  });

  // Projectors
  GestionnaireRéseauProjector.register();
  RaccordementProjector.register();

  // Sagas
  Raccordement.RaccordementSaga.register({
    récupérerGRDParVille,
  });

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
        'DateMiseEnServiceTransmise-V2',
        'DemandeComplèteDeRaccordementTransmise-V1',
        'DemandeComplèteDeRaccordementTransmise-V2',
        'DemandeComplèteRaccordementModifiée-V1',
        'DemandeComplèteRaccordementModifiée-V2',
        'DemandeComplèteRaccordementModifiée-V3',
        'GestionnaireRéseauRaccordementModifié-V1',
        'GestionnaireRéseauInconnuAttribué-V1',
        'PropositionTechniqueEtFinancièreModifiée-V1',
        'PropositionTechniqueEtFinancièreModifiée-V2',
        'PropositionTechniqueEtFinancièreSignéeTransmise-V1',
        'PropositionTechniqueEtFinancièreTransmise-V1',
        'PropositionTechniqueEtFinancièreTransmise-V2',
        'RéférenceDossierRacordementModifiée-V1',
        'RéférenceDossierRacordementModifiée-V2',
        'GestionnaireRéseauAttribué-V1',
        'DossierDuRaccordementSupprimé-V1',
        'RaccordementSupprimé-V1',
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

  const unsubscribeRaccordementAbandonSaga = await subscribe<
    Raccordement.RaccordementSaga.SubscriptionEvent & Event
  >({
    name: 'raccordement-abandon-saga',
    streamCategory: 'abandon',
    eventType: ['AbandonAccordé-V1'],
    eventHandler: async (event) => {
      await mediator.publish<Raccordement.RaccordementSaga.Execute>({
        type: 'System.Réseau.Raccordement.Saga.Execute',
        data: event,
      });
    },
  });
  const unsubscribeRaccordementLauréatSaga = await subscribe<
    Raccordement.RaccordementSaga.SubscriptionEvent & Event
  >({
    name: 'raccordement-laureat-saga',
    streamCategory: 'lauréat',
    eventType: ['LauréatNotifié-V1'],
    eventHandler: async (event) => {
      await mediator.publish<Raccordement.RaccordementSaga.Execute>({
        type: 'System.Réseau.Raccordement.Saga.Execute',
        data: event,
      });
    },
  });

  return async () => {
    await unsubscribeGestionnaireRéseauProjector();
    await unsubscribeRaccordementProjector();
    await unsubscribeRaccordementAbandonSaga();
    await unsubscribeRaccordementLauréatSaga();
  };
};
