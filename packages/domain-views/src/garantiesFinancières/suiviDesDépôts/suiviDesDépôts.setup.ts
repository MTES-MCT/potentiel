import { mediator } from 'mediateur';
import { Subscribe } from '@potentiel/core-domain';
import { SuiviDépôtsGarantiesFinancièresEvent } from '@potentiel/domain';
import {
  ConsulterSuiviDépôtGarantiesFinancièresDependencies,
  registerConsulterSuiviDépôtGarantiesFinancièresQuery,
} from './consulter/consulterSuiviDépôtGarantiesFinancières.query';
import {
  ExecuteSuiviDépôtsGarantiesFinancièresProjector,
  SuiviDépôtsGarantiesFinancièresProjectorDependencies,
  registerSuiviDépôtsGarantiesFinancièresProjector,
} from './suiviDesDépôts.projector';
import {
  ListerDépôtsGarantiesFinancièresEnAttenteDependencies,
  registerListerDépôtsGarantiesFinancièresEnAttenteQuery,
} from './lister/listerGarantiesFinancièresÀDéposer.query';

// Setup
export type SuiviDépôtsGarantiesFinancièresDependencies = {
  subscribe: Subscribe;
} & ConsulterSuiviDépôtGarantiesFinancièresDependencies &
  SuiviDépôtsGarantiesFinancièresProjectorDependencies &
  ListerDépôtsGarantiesFinancièresEnAttenteDependencies;

export const setupSuiviDépôtsGarantiesFinancièresViews = async (
  dependencies: SuiviDépôtsGarantiesFinancièresDependencies,
) => {
  // Queries
  registerConsulterSuiviDépôtGarantiesFinancièresQuery(dependencies);
  registerListerDépôtsGarantiesFinancièresEnAttenteQuery(dependencies);

  // Projectors
  registerSuiviDépôtsGarantiesFinancièresProjector(dependencies);

  // Subscribes
  const { subscribe } = dependencies;

  return [
    await subscribe<SuiviDépôtsGarantiesFinancièresEvent>({
      name: 'suivi_depot_garanties_financieres_projector',
      eventType: [
        'GarantiesFinancièresSnapshot-v1',
        'DépôtGarantiesFinancièresSupprimé-v1',
        'GarantiesFinancièresDéposées-v1',
        'DépôtGarantiesFinancièresValidé-v1',
      ],
      eventHandler: async (event: SuiviDépôtsGarantiesFinancièresEvent) => {
        await mediator.publish<ExecuteSuiviDépôtsGarantiesFinancièresProjector>({
          type: 'SUIVI_DÉPÔTS_GARANTIES_FINANCIÈRES_PROJECTOR',
          data: event,
        });
      },
    }),
  ];
};
