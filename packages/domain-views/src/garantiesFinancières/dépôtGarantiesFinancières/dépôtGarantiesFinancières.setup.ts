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
import {
  ListerDépôtsGarantiesFinancièresDependencies,
  registerListerDépôtsGarantiesFinancièresQuery,
} from './lister/listerDépôtsGarantiesFinancières.query';

// Setup
export type DépôtGarantiesFinancièresDependencies = {
  subscribe: Subscribe;
} & ConsulterDépôtGarantiesFinancièresDependencies &
  DépôtGarantiesFinancièresProjectorDependencies &
  ConsulterFichierdépôtAttestationGarantiesFinancièresDependencies &
  ListerDépôtsGarantiesFinancièresDependencies;

export const setupDépôtGarantiesFinancièreViews = async (
  dependencies: DépôtGarantiesFinancièresDependencies,
) => {
  // Queries
  registerConsulterDépôtGarantiesFinancièresQuery(dependencies);
  registerConsulterFichierDépôtAttestationGarantiesFinancièresQuery(dependencies);
  registerListerDépôtsGarantiesFinancièresQuery(dependencies);

  // Projectors
  registerDépôtGarantiesFinancièresProjector(dependencies);

  // Subscribes
  const { subscribe } = dependencies;

  return [
    await subscribe<DépôtGarantiesFinancièresEvent>({
      name: 'depot_garanties_financieres_projector',
      eventType: [
        'GarantiesFinancièresSnapshot-v1',
        'GarantiesFinancièresDéposées-v1',
        'DépôtGarantiesFinancièresModifié-v1',
        'DépôtGarantiesFinancièresValidé-v1',
        'DépôtGarantiesFinancièresSupprimé-v1',
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
