import { mediator } from 'mediateur';
import { Subscribe } from '@potentiel/core-domain';
import { DépôtGarantiesFinancièresEvent } from '@potentiel/domain';
import {
  ConsulterDépôtGarantiesFinancièresDependencies,
  registerConsulterDépôtGarantiesFinancièresQuery,
} from './consulter/consulterDépôtGarantiesFinancières.query';
import {
  DépôtGarantiesFinancièresProjectorDependencies,
  ExecuteDépôtGarantiesFinancièresProjector,
  registerDépôtGarantiesFinancièresProjector,
} from './dépôtGarantiesFinancières.projector';
import {
  ConsulterFichierdépôtAttestationGarantiesFinancièresDependencies,
  registerConsulterFichierDépôtAttestationGarantiesFinancièresQuery,
} from './consulter/consulterFichierDépôtAttestationGarantiesFinancières.query';

// Setup
export type DépôtGarantiesFinancièresDependencies = {
  subscribe: Subscribe;
} & ConsulterDépôtGarantiesFinancièresDependencies &
  DépôtGarantiesFinancièresProjectorDependencies &
  ConsulterFichierdépôtAttestationGarantiesFinancièresDependencies;

export const setupDépôtGarantiesFinancièreViews = async (
  dependencies: DépôtGarantiesFinancièresDependencies,
) => {
  // Queries
  registerConsulterDépôtGarantiesFinancièresQuery(dependencies);
  registerConsulterFichierDépôtAttestationGarantiesFinancièresQuery(dependencies);

  // Projectors
  registerDépôtGarantiesFinancièresProjector(dependencies);

  // Subscribes
  const { subscribe } = dependencies;

  return [
    await subscribe<DépôtGarantiesFinancièresEvent>({
      name: 'depot_garanties_financieres_projector',
      eventType: [
        'GarantiesFinancièresDéposéesSnapshot',
        'GarantiesFinancièresDéposées',
        'DépôtGarantiesFinancièresModifié',
      ],
      eventHandler: async (event: DépôtGarantiesFinancièresEvent) => {
        await mediator.publish<ExecuteDépôtGarantiesFinancièresProjector>({
          type: 'EXECUTE_DÉPÔT_GARANTIES_FINANCIÈRES_PROJECTOR',
          data: event,
        });
      },
    }),
  ];
};
