import { mediator } from 'mediateur';
import { Subscribe } from '@potentiel/core-domain';
import { EnregistrementGarantiesFinancièresEvent } from '@potentiel/domain';
import {
  ConsulterGarantiesFinancièresDependencies,
  registerConsulterGarantiesFinancièresQuery,
} from './consulter/consulterGarantiesFinancières.query';
import {
  ExecuteGarantiesFinancièresProjector,
  GarantiesFinancièresProjectorDependencies,
  registerGarantiesFinancièresProjector,
} from './garantiesFinancières.projector';
import {
  ConsulterFichierAttestationGarantiesFinancièresDependencies,
  registerConsulterFichierAttestationGarantiesFinancièresQuery,
} from './consulter/consulterFichierAttestationGarantiesFinancières.query';
import { RebuildTriggered } from '@potentiel/core-domain-views';

// Setup
export type GarantiesFinancièresDependencies = {
  subscribe: Subscribe;
} & ConsulterGarantiesFinancièresDependencies &
  GarantiesFinancièresProjectorDependencies &
  ConsulterFichierAttestationGarantiesFinancièresDependencies;

export const setupGarantiesFinancièreViews = async (
  dependencies: GarantiesFinancièresDependencies,
) => {
  // Queries
  registerConsulterGarantiesFinancièresQuery(dependencies);
  registerConsulterFichierAttestationGarantiesFinancièresQuery(dependencies);

  // Projectors
  registerGarantiesFinancièresProjector(dependencies);

  // Subscribes
  const { subscribe } = dependencies;

  return [
    await subscribe({
      name: 'gf-projector',
      eventType: [
        'RebuildTriggered',
        'GarantiesFinancièresSnapshot-v1',
        'GarantiesFinancièresEnregistrées-v1',
        'TypeGarantiesFinancièresImporté-v1',
      ],
      eventHandler: async (event: EnregistrementGarantiesFinancièresEvent | RebuildTriggered) => {
        await mediator.publish<ExecuteGarantiesFinancièresProjector>({
          type: 'EXECUTE_GARANTIES_FINANCIÈRES_PROJECTOR',
          data: event,
        });
      },
      streamCategory: 'garanties-financières',
    }),
  ];
};
