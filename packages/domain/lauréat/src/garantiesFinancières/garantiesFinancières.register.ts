import { LoadAggregate } from '@potentiel-domain/core';

import { registerListerProjetsAvecGarantiesFinancièresEnAttenteQuery } from './projetEnAttenteDeGarantiesFinancières/lister/listerProjetsAvecGarantiesFinancièresEnAttente.query';
import { registerConsulterProjetAvecGarantiesFinancièresEnAttenteQuery } from './projetEnAttenteDeGarantiesFinancières/consulter/consulterProjetAvecGarantiesFinancièresEnAttente.query';
import {
  ListerMainlevéesQueryDependencies,
  registerListerMainlevéesQuery,
} from './mainlevée/lister/listerMainlevéesGarantiesFinancières.query';
import {
  ConsulterArchivesGarantiesFinancièresDependencies,
  registerConsulterArchivesGarantiesFinancièresQuery,
} from './garantiesFinancièresActuelles/consulterArchives/consulterArchivesGarantiesFinancières.query';

export type GarantiesFinancièresQueryDependencies =
  ConsulterArchivesGarantiesFinancièresDependencies & ListerMainlevéesQueryDependencies;

export type GarantiesFinancièresCommandDependencies = {
  loadAggregate: LoadAggregate;
};

export const registerGarantiesFinancièresQueries = (
  dependencies: GarantiesFinancièresQueryDependencies,
) => {
  registerConsulterArchivesGarantiesFinancièresQuery(dependencies);
  registerConsulterProjetAvecGarantiesFinancièresEnAttenteQuery(dependencies);
  registerListerProjetsAvecGarantiesFinancièresEnAttenteQuery(dependencies);
  registerListerMainlevéesQuery(dependencies);
};
