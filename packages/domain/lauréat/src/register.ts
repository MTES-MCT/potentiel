import {
  GarantiesFinancièresCommandDependencies,
  GarantiesFinancièresQueryDependencies,
  registerGarantiesFinancièresQueries,
  registerGarantiesFinancièresUseCases,
} from './garantiesFinancières/garantiesFinancières.register';

export type LauréatQueryDependencies = GarantiesFinancièresQueryDependencies;

export type LauréatCommandDependencies = GarantiesFinancièresCommandDependencies;

export const registerLauréatUseCases = (dependencies: LauréatCommandDependencies) => {
  registerGarantiesFinancièresUseCases(dependencies);
};

export const registerLauréatQueries = (dependencies: LauréatQueryDependencies) => {
  registerGarantiesFinancièresQueries(dependencies);
};
