import {
  type ConsulterGarantiesFinancièresEnAttenteDependencies,
  registerConsulterGarantiesFinancièresEnAttenteQuery,
} from './consulter/consulterGarantiesFinancièresEnAttente.query.js';
import {
  type ListerGarantiesFinancièresEnAttenteDependencies,
  registerListerGarantiesFinancièresEnAttenteQuery,
} from './lister/listerProjetsAvecGarantiesFinancièresEnAttente.query.js';

export type GarantiesFinancièresEnAttenteQueryDependencies =
  ListerGarantiesFinancièresEnAttenteDependencies &
    ConsulterGarantiesFinancièresEnAttenteDependencies;

export const registerGarantiesFinancièresEnAttenteQueries = (
  dependencies: GarantiesFinancièresEnAttenteQueryDependencies,
) => {
  registerListerGarantiesFinancièresEnAttenteQuery(dependencies);
  registerConsulterGarantiesFinancièresEnAttenteQuery(dependencies);
};
