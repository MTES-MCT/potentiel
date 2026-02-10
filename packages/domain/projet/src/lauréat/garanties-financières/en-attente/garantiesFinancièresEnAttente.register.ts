import {
  ConsulterGarantiesFinancièresEnAttenteDependencies,
  registerConsulterGarantiesFinancièresEnAttenteQuery,
} from './consulter/consulterProjetAvecGarantiesFinancièresEnAttente.query.js';
import {
  ListerGarantiesFinancièresEnAttenteDependencies,
  registerListerGarantiesFinancièresEnAttenteQuery,
} from './lister/listerProjetsAvecGarantiesFinancièresEnAttente.query.js';

export type GarantiesFinancièresEnAttenteQueryDependencies =
  ConsulterGarantiesFinancièresEnAttenteDependencies &
    ListerGarantiesFinancièresEnAttenteDependencies;

export const registerGarantiesFinancièresEnAttenteQueries = (
  dependencies: GarantiesFinancièresEnAttenteQueryDependencies,
) => {
  registerConsulterGarantiesFinancièresEnAttenteQuery(dependencies);
  registerListerGarantiesFinancièresEnAttenteQuery(dependencies);
};
