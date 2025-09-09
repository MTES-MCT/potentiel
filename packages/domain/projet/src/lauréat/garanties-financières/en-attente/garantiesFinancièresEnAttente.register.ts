import {
  ConsulterGarantiesFinancièresEnAttenteDependencies,
  registerConsulterGarantiesFinancièresEnAttenteQuery,
} from './consulter/consulterProjetAvecGarantiesFinancièresEnAttente.query';
import {
  ListerGarantiesFinancièresEnAttenteDependencies,
  registerListerGarantiesFinancièresEnAttenteQuery,
} from './lister/listerProjetsAvecGarantiesFinancièresEnAttente.query';

export type GarantiesFinancièresEnAttenteQueryDependencies =
  ConsulterGarantiesFinancièresEnAttenteDependencies &
    ListerGarantiesFinancièresEnAttenteDependencies;

export const registerGarantiesFinancièresEnAttenteQueries = (
  dependencies: GarantiesFinancièresEnAttenteQueryDependencies,
) => {
  registerConsulterGarantiesFinancièresEnAttenteQuery(dependencies);
  registerListerGarantiesFinancièresEnAttenteQuery(dependencies);
};
