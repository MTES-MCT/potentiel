import { LoadAggregate } from '@potentiel-domain/core';

import {
  ListerProjetsAvecGarantiesFinancièresEnAttenteDependencies,
  registerListerProjetsAvecGarantiesFinancièresEnAttenteQuery,
} from './projetEnAttenteDeGarantiesFinancières/lister/listerProjetsAvecGarantiesFinancièresEnAttente.query';
import {
  ConsulterProjetAvecGarantiesFinancièresEnAttenteDependencies,
  registerConsulterProjetAvecGarantiesFinancièresEnAttenteQuery,
} from './projetEnAttenteDeGarantiesFinancières/consulter/consulterProjetAvecGarantiesFinancièresEnAttente.query';

export type GarantiesFinancièresQueryDependencies =
  ConsulterProjetAvecGarantiesFinancièresEnAttenteDependencies &
    ListerProjetsAvecGarantiesFinancièresEnAttenteDependencies;

export type GarantiesFinancièresCommandDependencies = {
  loadAggregate: LoadAggregate;
};

export const registerGarantiesFinancièresQueries = (
  dependencies: GarantiesFinancièresQueryDependencies,
) => {
  registerConsulterProjetAvecGarantiesFinancièresEnAttenteQuery(dependencies);
  registerListerProjetsAvecGarantiesFinancièresEnAttenteQuery(dependencies);
};
