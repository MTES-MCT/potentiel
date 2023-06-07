import { mediator } from 'mediateur';
import { Subscribe } from '@potentiel/core-domain';
import { GestionnaireRéseauEvent } from '@potentiel/domain';
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

export const setupGestionnaireRéseauViews = (dependencies: GestionnaireRéseauDependencies) => {
  // Query
  registerConsulterGestionnaireRéseauQuery(dependencies);
  registerListerGestionnaireRéseauQuery(dependencies);

  // Projectors
  registerGestionnaireRéseauProjector(dependencies);

  // Subscribes
  const { subscribe } = dependencies;
  return [
    subscribe<GestionnaireRéseauEvent>(
      ['GestionnaireRéseauAjouté', 'GestionnaireRéseauModifié'],
      async (event: GestionnaireRéseauEvent) => {
        await mediator.send<ExecuteGestionnaireRéseauProjector>({
          type: 'EXECUTE_GESTIONNAIRE_RÉSEAU_PROJECTOR',
          data: event,
        });
      },
    ),
  ];
};
