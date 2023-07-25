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
    await subscribe<ProjetEvent>(
      [
        'GestionnaireRéseauProjetDéclaré',
        'GestionnaireRéseauProjetModifié',
        'AttestationGarantiesFinancièresEnregistrée',
        'TypeGarantiesFinancièresEnregistré',
      ],
      async (event: ProjetEvent) => {
        await mediator.publish<ExecuteProjetProjector>({
          type: 'EXECUTE_PROJET_PROJECTOR',
          data: event,
        });
      },
    ),
  ];
};
