import { mediator } from 'mediateur';
import { Subscribe } from '@potentiel/core-domain';
import { ProjetEvent } from '@potentiel/domain';
import { ConsulterGestionnaireRéseauDependencies } from '../gestionnaireRéseau/consulter/consulterGestionnaireRéseau.query';
import {
  ConsulterProjetQuery,
  registerConsulterProjetQuery,
} from './consulter/consulterProjet.query';
import {
  registerProjetProjector,
  ExecuteProjetProjector,
  ProjetProjectorDependencies,
} from './project.projector';
import { ProjetReadModel } from './projet.readModel';

// Queries
type ProjetQuery = ConsulterProjetQuery;

// Setup
type ProjetDependencies = { subscribe: Subscribe } & ConsulterGestionnaireRéseauDependencies &
  ProjetProjectorDependencies;

const setupProjetViews = (dependencies: ProjetDependencies) => {
  // Queries
  registerConsulterProjetQuery(dependencies);

  // Projectors
  registerProjetProjector(dependencies);

  // Subscribes
  const { subscribe } = dependencies;
  return [
    subscribe<ProjetEvent>(['GestionnaireRéseauProjetModifié'], async (event: ProjetEvent) => {
      await mediator.send<ExecuteProjetProjector>({
        type: 'EXECUTE_PROJET_PROJECTOR',
        data: event,
      });
    }),
  ];
};

export { ProjetReadModel, ProjetQuery, ConsulterProjetQuery, setupProjetViews as setupProjet };
