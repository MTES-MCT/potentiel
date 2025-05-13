import { GetProjetAggregateRoot } from '../../getProjetAggregateRoot.port';

import { registerRenouvelerGarantiesFinancièresUseCase } from './renouveler/renouvelerGarantiesFinancières.usecase';

export type GarantiesFinancièresCommandDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export const registerGarantiesFinancièresUseCases = (
  dependencies: GarantiesFinancièresCommandDependencies,
) => {
  registerRenouvelerGarantiesFinancièresUseCase(dependencies.getProjetAggregateRoot);
};
