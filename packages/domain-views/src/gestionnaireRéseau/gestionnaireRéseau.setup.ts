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
    await subscribe<GestionnaireRéseauEvent>({
      name: 'GestionnaireRéseauProjectorSubscriber',
      eventType: ['GestionnaireRéseauAjouté', 'GestionnaireRéseauModifié'],
      eventHandler: async (event: GestionnaireRéseauEvent) => {
        await mediator.publish<ExecuteGestionnaireRéseauProjector>({
          type: 'EXECUTE_GESTIONNAIRE_RÉSEAU_PROJECTOR',
          data: event,
        });
      },
    }),
  ];
};
