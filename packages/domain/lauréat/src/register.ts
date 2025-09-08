import {
  GarantiesFinancièresCommandDependencies,
  GarantiesFinancièresQueryDependencies,
  registerGarantiesFinancièresQueries,
} from './garantiesFinancières/garantiesFinancières.register';

export type LauréatQueryDependencies = GarantiesFinancièresQueryDependencies;

export type LauréatCommandDependencies = GarantiesFinancièresCommandDependencies;

export const registerLauréatQueries = (dependencies: LauréatQueryDependencies) => {
  registerGarantiesFinancièresQueries(dependencies);
};
