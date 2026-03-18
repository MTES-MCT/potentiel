import {
  ListerGarantiesFinancièresEnAttenteDependencies,
  registerListerGarantiesFinancièresEnAttenteQuery,
} from './lister/listerProjetsAvecGarantiesFinancièresEnAttente.query.js';

export type GarantiesFinancièresEnAttenteQueryDependencies =
  ListerGarantiesFinancièresEnAttenteDependencies;

export const registerGarantiesFinancièresEnAttenteQueries = (
  dependencies: GarantiesFinancièresEnAttenteQueryDependencies,
) => {
  registerListerGarantiesFinancièresEnAttenteQuery(dependencies);
};
