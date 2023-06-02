import { mediator } from 'mediateur';
import { ProjetEvent } from '@potentiel/domain/dist/projet/aggregate/projet.aggregate';
import { ConsulterGestionnaireRéseauDependencies } from '../gestionnaireRéseau/consulter/consulterGestionnaireRéseau.query';
import { Subscribe } from '../subscribe';
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

const setupProjet = (dependencies: ProjetDependencies) => {
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

export { ProjetReadModel, ProjetQuery, ConsulterProjetQuery, setupProjet };
