import { mediator } from 'mediateur';
import { Subscribe } from '@potentiel/core-domain';
import { ProjetEvent } from '@potentiel/domain';
import {
  ConsulterProjetDependencies,
  registerConsulterProjetQuery,
} from './consulter/consulterProjet.query';
import {
  registerProjetProjector,
  ExecuteProjetProjector,
  ProjetProjectorDependencies,
} from './project.projector';

// Setup
type ProjetDependencies = { subscribe: Subscribe } & ConsulterProjetDependencies &
  ProjetProjectorDependencies;

export const setupProjetViews = async (dependencies: ProjetDependencies) => {
  // Queries
  registerConsulterProjetQuery(dependencies);

  // Projectors
  registerProjetProjector(dependencies);

  // Subscribes
  const { subscribe } = dependencies;
  return [
    await subscribe<ProjetEvent>({
      name: 'ProjetProjectorSubscriber',
      eventType: ['GestionnaireRéseauProjetDéclaré', 'GestionnaireRéseauProjetModifié'],
      eventHandler: async (event: ProjetEvent) => {
        await mediator.publish<ExecuteProjetProjector>({
          type: 'EXECUTE_PROJET_PROJECTOR',
          data: event,
        });
      },
    }),
  ];
};
