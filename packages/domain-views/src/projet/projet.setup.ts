import { mediator } from 'mediateur';
import { Subscribe } from '@potentiel/core-domain';
import { GestionnaireRéseauProjetEvent } from '@potentiel/domain';
import {
  ConsulterProjetDependencies,
  registerConsulterProjetQuery,
} from './consulter/consulterProjet.query';
import {
  registerProjetProjector,
  ExecuteProjetProjector,
  ProjetProjectorDependencies,
} from './project.projector';
import { RebuildTriggered } from '@potentiel/core-domain-views';

// Setup
export type ProjetDependencies = { subscribe: Subscribe } & ConsulterProjetDependencies &
  ProjetProjectorDependencies;

export const setupProjetViews = async (dependencies: ProjetDependencies) => {
  // Queries
  registerConsulterProjetQuery(dependencies);

  // Projectors
  registerProjetProjector(dependencies);

  // Subscribes
  const { subscribe } = dependencies;
  return [
    await subscribe({
      name: 'projector',
      eventType: [
        'GestionnaireRéseauProjetDéclaré',
        'GestionnaireRéseauProjetModifié',
        'RebuildTriggered',
      ],
      eventHandler: async (event: GestionnaireRéseauProjetEvent | RebuildTriggered) => {
        await mediator.publish<ExecuteProjetProjector>({
          type: 'EXECUTE_PROJET_PROJECTOR',
          data: event,
        });
      },
      streamCategory: 'projet',
    }),
  ];
};
