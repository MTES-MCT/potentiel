import { mediator } from 'mediateur';
import { Subscribe } from '../subscribe';
import {
  ConsulterGestionnaireRéseauDependencies,
  ConsulterGestionnaireRéseauQuery,
  registerConsulterGestionnaireRéseauQuery,
} from './consulter/consulterGestionnaireRéseau.query';
import {
  ExecuteGestionnaireRéseauProjector,
  GestionnaireRéseauProjectorDependencies,
  registerGestionnaireRéseauProjector,
} from './gestionnaireRéseau.projector';
import {
  ListerGestionnaireRéseauDependencies,
  ListerGestionnaireRéseauQuery,
  registerListerGestionnaireRéseauQuery,
} from './lister/listerGestionnaireRéseau.query';
import { GestionnaireRéseauEvent } from '@potentiel/domain/dist/gestionnaireRéseau/aggregate/gestionnaireRéseau.aggregate';
import { GestionnaireRéseauReadModel } from './gestionnaireRéseau.readModel';

// Queries
type GestionnaireRéseauQuery = ConsulterGestionnaireRéseauQuery | ListerGestionnaireRéseauQuery;

// Setup
type GestionnaireRéseauDependencies = {
  subscribe: Subscribe;
} & ConsulterGestionnaireRéseauDependencies &
  ListerGestionnaireRéseauDependencies &
  GestionnaireRéseauProjectorDependencies;

const setupGestionnaireRéseau = (dependencies: GestionnaireRéseauDependencies) => {
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

export {
  GestionnaireRéseauReadModel,
  GestionnaireRéseauQuery,
  ConsulterGestionnaireRéseauQuery,
  ListerGestionnaireRéseauQuery,
  setupGestionnaireRéseau,
};
