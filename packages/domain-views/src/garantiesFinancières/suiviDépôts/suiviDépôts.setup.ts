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
} from './suiviDépôts.projector';
import {
  ListerDépôtsGarantiesFinancièresEnAttenteDependencies,
  registerListerDépôtsGarantiesFinancièresEnAttenteQuery,
} from './lister/listerGarantiesFinancièresÀDéposer.query';
import { RebuildTriggered } from '@potentiel/core-domain-views';

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
    await subscribe({
      name: 'suivi-depot-gf-projector',
      eventType: [
        'GarantiesFinancièresSnapshot-v1',
        'DépôtGarantiesFinancièresSupprimé-v1',
        'GarantiesFinancièresDéposées-v1',
        'DépôtGarantiesFinancièresValidé-v1',
        'RebuildTriggered',
      ],
      eventHandler: async (event: SuiviDépôtsGarantiesFinancièresEvent | RebuildTriggered) => {
        await mediator.publish<ExecuteSuiviDépôtsGarantiesFinancièresProjector>({
          type: 'SUIVI_DÉPÔTS_GARANTIES_FINANCIÈRES_PROJECTOR',
          data: event,
        });
      },
      streamCategory: 'garanties-financières',
    }),
  ];
};
