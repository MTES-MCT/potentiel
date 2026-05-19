import {
  type GarantiesFinancièresActuellesQueryDependencies,
  type GarantiesFinancièresActuellesUseCasesDependencies,
  registerGarantiesFinancièresActuellesQueries,
  registerGarantiesFinancièresActuellesUseCases,
} from './actuelles/garantiesFinancièresActuelles.register.js';
import {
  type DépôtGarantiesFinancièresQueryDependencies,
  type DépôtGarantiesFinancièresUseCasesDependencies,
  registerDépôtGarantiesFinancièresQueries,
  registerDépôtGarantiesFinancièresUseCases,
} from './dépôt/dépôtGarantiesFinancières.register.js';
import { registerGarantiesFinancièresEnAttenteQueries } from './en-attente/garantiesFinancièresEnAttente.register.js';
import {
  type MainlevéeGarantiesFinancièresQueryDependencies,
  type MainlevéeGarantiesFinancièresUseCasesDependencies,
  registerMainlevéeGarantiesFinancièresQueries,
  registerMainlevéeGarantiesFinancièresUseCases,
} from './mainlevée/mainlevéeGarantiesFinancières.register.js';

export type GarantiesFinancièresQueryDependencies = GarantiesFinancièresActuellesQueryDependencies &
  DépôtGarantiesFinancièresQueryDependencies &
  MainlevéeGarantiesFinancièresQueryDependencies;

export type GarantiesFinancièresUseCasesDependencies =
  | GarantiesFinancièresActuellesUseCasesDependencies
  | DépôtGarantiesFinancièresUseCasesDependencies
  | MainlevéeGarantiesFinancièresUseCasesDependencies;

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
  registerGarantiesFinancièresEnAttenteQueries(dependencies);
};
