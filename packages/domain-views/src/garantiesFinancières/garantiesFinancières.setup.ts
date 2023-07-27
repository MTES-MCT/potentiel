import { mediator } from 'mediateur';
import { Subscribe } from '@potentiel/core-domain';
import { GarantiesFinancièresEvent } from '@potentiel/domain';
import {
  ConsulterGarantiesFinancièresDependencies,
  registerConsulterGarantiesFinancièresQuery,
} from './consulter/consulterGarantiesFinancières.query';
import {
  ExecuteGarantiesFinancièresProjector,
  GarantiesFinancièresProjectorDependencies,
  registerGarantiesFinancièresProjector,
} from './garantiesFinancières.projector';

// Setup
type GarantiesFinancièresDependencies = {
  subscribe: Subscribe;
} & ConsulterGarantiesFinancièresDependencies &
  GarantiesFinancièresProjectorDependencies;

export const setupGarantiesFinancièreViews = async (
  dependencies: GarantiesFinancièresDependencies,
) => {
  // Queries
  registerConsulterGarantiesFinancièresQuery(dependencies);

  // Projectors
  registerGarantiesFinancièresProjector(dependencies);

  // Subscribes
  const { subscribe } = dependencies;
  return [
    await subscribe<GarantiesFinancièresEvent>(
      ['AttestationGarantiesFinancièresEnregistrée', 'TypeGarantiesFinancièresEnregistré'],
      async (event: GarantiesFinancièresEvent) => {
        await mediator.publish<ExecuteGarantiesFinancièresProjector>({
          type: 'EXECUTE_GARANTIES_FINANCIÈRES_PROJECTOR',
          data: event,
        });
      },
    ),
  ];
};
