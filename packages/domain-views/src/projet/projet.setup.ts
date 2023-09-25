import { mediator } from 'mediateur';
import { Subscribe } from '@potentiel/core-domain';
import { AbandonEvent, GestionnaireRéseauProjetEvent } from '@potentiel/domain';
import {
  ConsulterProjetDependencies,
  registerConsulterLegacyProjetQuery,
} from './consulter/consulterLegacyProjet.query';
import {
  registerProjetProjector,
  ExecuteProjetProjector,
  ProjetProjectorDependencies,
} from './project.projector';
import { RebuildTriggered } from '@potentiel/core-domain-views';
import { registerConsulterProjetQuery } from './consulter/consulterProjet.query';

// Setup
export type ProjetDependencies = { subscribe: Subscribe } & ConsulterProjetDependencies &
  ProjetProjectorDependencies;

export const setupProjetViews = async (dependencies: ProjetDependencies) => {
  // Queries
  registerConsulterProjetQuery(dependencies);
  registerConsulterLegacyProjetQuery(dependencies);

  // Projectors
  registerProjetProjector(dependencies);

  // Subscribes
  const { subscribe } = dependencies;
  return [
    await subscribe({
      name: 'projector-gestionnaire-reseau',
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
    await subscribe({
      name: 'projector-abandon',
      eventType: ['AbandonDemandé'],
      eventHandler: async (event: AbandonEvent) => {
        await mediator.publish<ExecuteProjetProjector>({
          type: 'EXECUTE_PROJET_PROJECTOR',
          data: event,
        });
      },
      streamCategory: 'abandon',
    }),
  ];
};
