import { mediator } from 'mediateur';
import { Subscribe } from '@potentiel/core-domain';
import { ProjetEvent } from '@potentiel/domain';
import { ConsulterGestionnaireRéseauDependencies } from '../gestionnaireRéseau/consulter/consulterGestionnaireRéseau.query';
import { registerConsulterProjetQuery } from './consulter/consulterProjet.query';
import {
  registerProjetProjector,
  ExecuteProjetProjector,
  ProjetProjectorDependencies,
} from './project.projector';

// Setup
type ProjetDependencies = { subscribe: Subscribe } & ConsulterGestionnaireRéseauDependencies &
  ProjetProjectorDependencies;

export const setupProjetViews = (dependencies: ProjetDependencies) => {
  // Queries
  registerConsulterProjetQuery(dependencies);

  // Projectors
  registerProjetProjector(dependencies);

  // Subscribes
  const { subscribe } = dependencies;
  return [
    subscribe<ProjetEvent>(
      ['GestionnaireRéseauProjetDéclaré', 'GestionnaireRéseauProjetModifié'],
      async (event: ProjetEvent) => {
        await mediator.send<ExecuteProjetProjector>({
          type: 'EXECUTE_PROJET_PROJECTOR',
          data: event,
        });
      },
    ),
  ];
};
