import {
  GarantiesFinancièresActuellesUseCasesDependencies,
  registerGarantiesFinancièresActuellesQueries,
  GarantiesFinancièresActuellesQueryDependencies,
  registerGarantiesFinancièresActuellesUseCases,
} from './actuelles/garantiesFinancièresActuelles.register';
import {
  DépôtGarantiesFinancièresQueryDependencies,
  DépôtGarantiesFinancièresUseCasesDependencies,
  registerDépôtGarantiesFinancièresQueries,
  registerDépôtGarantiesFinancièresUseCases,
} from './dépôt/dépôtGarantiesFinancières.register';

export type GarantiesFinancièresQueryDependencies =
  | GarantiesFinancièresActuellesQueryDependencies
  | DépôtGarantiesFinancièresQueryDependencies;

export type GarantiesFinancièresUseCasesDependencies =
  | GarantiesFinancièresActuellesUseCasesDependencies
  | DépôtGarantiesFinancièresUseCasesDependencies;

export const registerGarantiesFinancièresUseCases = (
  dependencies: GarantiesFinancièresUseCasesDependencies,
) => {
  registerGarantiesFinancièresActuellesUseCases(dependencies);
  registerDépôtGarantiesFinancièresUseCases(dependencies);
};

export const registerGarantiesFinancièresQueries = (
  dependencies: GarantiesFinancièresQueryDependencies,
) => {
  registerGarantiesFinancièresActuellesQueries(dependencies);
  registerDépôtGarantiesFinancièresQueries(dependencies);
};
