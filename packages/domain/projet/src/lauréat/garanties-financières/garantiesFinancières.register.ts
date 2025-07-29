import {
  GarantiesFinancièresActuellesUseCasesDependencies,
  registerGarantiesFinancièresActuellesQueries,
  GarantiesFinancièresActuellesQueryDependencies,
  registerGarantiesFinancièresActuellesUseCases,
} from './actuelles/garantiesFinancièresActuelles.register';

export type GarantiesFinancièresQueryDependencies = GarantiesFinancièresActuellesQueryDependencies;

export type GarantiesFinancièresUseCasesDependencies =
  GarantiesFinancièresActuellesUseCasesDependencies;

export const registerGarantiesFinancièresUseCases = (
  dependencies: GarantiesFinancièresUseCasesDependencies,
) => {
  registerGarantiesFinancièresActuellesUseCases(dependencies);
};

export const registerGarantiesFinancièresQueries = (
  dependencies: GarantiesFinancièresQueryDependencies,
) => {
  registerGarantiesFinancièresActuellesQueries(dependencies);
};
