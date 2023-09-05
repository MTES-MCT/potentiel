import { mediator } from 'mediateur';
import { Subscribe } from '@potentiel/core-domain';
import { GarantiesFinancièresÀDéposerEvent } from '@potentiel/domain';
import {
  ConsulterGarantiesFinancièresÀDéposerDependencies,
  registerConsulterGarantiesFinancièresÀDéposerQuery,
} from './consulter/consulterGarantiesFinancièresÀDéposer.query';
import {
  ExecuteGarantiesFinancièresÀDéposerProjector,
  GarantiesFinancièresÀDéposerProjectorDependencies,
  registerGarantiesFinancièresÀDéposerProjector,
} from './garantiesFinancièresÀDéposer.projector';
import {
  ListerGarantiesFinancièresÀDéposerDependencies,
  registerListerGarantiesFinancièresÀDéposerQuery,
} from './lister/listerGarantiesFinancièresÀDéposer.query';

// Setup
export type GarantiesFinancièresÀDéposerDependencies = {
  subscribe: Subscribe;
} & ConsulterGarantiesFinancièresÀDéposerDependencies &
  ListerGarantiesFinancièresÀDéposerDependencies &
  GarantiesFinancièresÀDéposerProjectorDependencies;

export const setupGarantiesFinancièresÀDéposerViews = async (
  dependencies: GarantiesFinancièresÀDéposerDependencies,
) => {
  // Queries
  registerConsulterGarantiesFinancièresÀDéposerQuery(dependencies);
  registerListerGarantiesFinancièresÀDéposerQuery(dependencies);

  // Projectors
  registerGarantiesFinancièresÀDéposerProjector(dependencies);

  // Subscribes
  const { subscribe } = dependencies;

  return [
    await subscribe<GarantiesFinancièresÀDéposerEvent>({
      name: 'garanties_financieres_a_deposer_projector',
      eventType: ['GarantiesFinancièresSnapshot-v1'],
      eventHandler: async (event: GarantiesFinancièresÀDéposerEvent) => {
        await mediator.publish<ExecuteGarantiesFinancièresÀDéposerProjector>({
          type: 'GARANTIES_FINANCIÈRES_À_DÉPOSER_PROJECTOR',
          data: event,
        });
      },
    }),
  ];
};
