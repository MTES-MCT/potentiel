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
import {
  registerMainlevéeGarantiesFinancièresQueries,
  registerMainlevéeGarantiesFinancièresUseCases,
} from './mainlevée/mainlevéeGarantiesFinancières.register';

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
  registerMainlevéeGarantiesFinancièresUseCases(dependencies);
};

export const registerGarantiesFinancièresQueries = (
  dependencies: GarantiesFinancièresQueryDependencies,
) => {
  registerGarantiesFinancièresActuellesQueries(dependencies);
  registerDépôtGarantiesFinancièresQueries(dependencies);
  registerMainlevéeGarantiesFinancièresQueries(dependencies);
};
