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
import {
  ConsulterFichierAttestationGarantiesFinancièresDependencies,
  registerConsulterFichierAttestationGarantiesFinancièresQuery,
} from './consulter/consulterFichierAttestationGarantiesFinancières.query';

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
    await subscribe<GarantiesFinancièresEvent>({
      name: 'garanties_financieres_projector',
      eventType: [
        'AttestationGarantiesFinancièresEnregistrée',
        'TypeGarantiesFinancièresEnregistré-v0',
        'TypeGarantiesFinancièresEnregistré-v1',
      ],
      eventHandler: async (event: GarantiesFinancièresEvent) => {
        await mediator.publish<ExecuteGarantiesFinancièresProjector>({
          type: 'EXECUTE_GARANTIES_FINANCIÈRES_PROJECTOR',
          data: event,
        });
      },
    }),
  ];
};
