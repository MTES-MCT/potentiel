import {
  GarantiesFinancièresCommandDependencies,
  GarantiesFinancièresQueryDependencies,
  registerGarantiesFinancièresQueries,
  registerGarantiesFinancièresUseCases,
} from './garantiesFinancières/garantiesFinancières.register';
import {
  RaccordementCommandDependencies,
  RaccordementQueryDependencies,
  registerRaccordementQueries,
  registerRaccordementUseCases,
} from './raccordement/raccordement.register';

export type LauréatQueryDependencies = GarantiesFinancièresQueryDependencies &
  RaccordementQueryDependencies;

export type LauréatCommandDependencies = GarantiesFinancièresCommandDependencies &
  RaccordementCommandDependencies;

export const registerLauréatUseCases = (dependencies: LauréatCommandDependencies) => {
  registerGarantiesFinancièresUseCases(dependencies);
  registerRaccordementUseCases(dependencies);
};

export const registerLauréatQueries = (dependencies: LauréatQueryDependencies) => {
  registerGarantiesFinancièresQueries(dependencies);
  registerRaccordementQueries(dependencies);
};
