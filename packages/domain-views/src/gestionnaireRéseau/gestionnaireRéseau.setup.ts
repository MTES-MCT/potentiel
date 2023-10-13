import { mediator } from 'mediateur';
import { Subscribe } from '@potentiel-domain/core';
import { RebuildTriggered } from '@potentiel-domain/core-views';
import { GestionnaireRéseauEvent } from '@potentiel/domain-usecases';
import {
  ConsulterGestionnaireRéseauDependencies,
  registerConsulterGestionnaireRéseauQuery,
} from './consulter/consulterGestionnaireRéseau.query';
import {
  GestionnaireRéseauProjectorDependencies,
  registerGestionnaireRéseauProjector,
  ExecuteGestionnaireRéseauProjector,
} from './gestionnaireRéseau.projector';
import {
  ListerGestionnaireRéseauDependencies,
  registerListerGestionnaireRéseauQuery,
} from './lister/listerGestionnaireRéseau.query';

// Setup
type GestionnaireRéseauDependencies = {
  subscribe: Subscribe;
} & ConsulterGestionnaireRéseauDependencies &
  ListerGestionnaireRéseauDependencies &
  GestionnaireRéseauProjectorDependencies;

export const setupGestionnaireRéseauViews = async (
  dependencies: GestionnaireRéseauDependencies,
) => {
  // Query
  registerConsulterGestionnaireRéseauQuery(dependencies);
  registerListerGestionnaireRéseauQuery(dependencies);

  // Projectors
  registerGestionnaireRéseauProjector(dependencies);

  // Subscribes
  const { subscribe } = dependencies;
  return [
    await subscribe({
      name: 'projector',
      eventType: [
        'GestionnaireRéseauAjouté-V1',
        'GestionnaireRéseauModifié-V1',
        'RebuildTriggered',
      ],
      eventHandler: async (event: GestionnaireRéseauEvent | RebuildTriggered) => {
        await mediator.publish<ExecuteGestionnaireRéseauProjector>({
          type: 'EXECUTE_GESTIONNAIRE_RÉSEAU_PROJECTOR',
          data: event,
        });
      },
      streamCategory: 'gestionnaire-réseau',
    }),
  ];
};
