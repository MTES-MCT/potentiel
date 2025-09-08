import { LoadAggregate } from '@potentiel-domain/core';

import { registerListerProjetsAvecGarantiesFinancièresEnAttenteQuery } from './projetEnAttenteDeGarantiesFinancières/lister/listerProjetsAvecGarantiesFinancièresEnAttente.query';
import {
  ConsulterProjetAvecGarantiesFinancièresEnAttenteDependencies,
  registerConsulterProjetAvecGarantiesFinancièresEnAttenteQuery,
} from './projetEnAttenteDeGarantiesFinancières/consulter/consulterProjetAvecGarantiesFinancièresEnAttente.query';
import {
  ListerMainlevéesQueryDependencies,
  registerListerMainlevéesQuery,
} from './mainlevée/lister/listerMainlevéesGarantiesFinancières.query';

export type GarantiesFinancièresQueryDependencies =
  ConsulterProjetAvecGarantiesFinancièresEnAttenteDependencies & ListerMainlevéesQueryDependencies;

export type GarantiesFinancièresCommandDependencies = {
  loadAggregate: LoadAggregate;
};

export const registerGarantiesFinancièresQueries = (
  dependencies: GarantiesFinancièresQueryDependencies,
) => {
  registerConsulterProjetAvecGarantiesFinancièresEnAttenteQuery(dependencies);
  registerListerProjetsAvecGarantiesFinancièresEnAttenteQuery(dependencies);
  registerListerMainlevéesQuery(dependencies);
};
