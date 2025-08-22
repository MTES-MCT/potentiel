import type { LoadAggregate } from '@potentiel-domain/core';
import type { GetProjetAggregateRoot } from '@potentiel-domain/projet';

import {
  type ConsulterDépôtEnCoursGarantiesFinancièresDependencies,
  registerConsulterDépôtEnCoursGarantiesFinancièresQuery,
} from './dépôtEnCours/consulter/consulterDépôtEnCoursGarantiesFinancières.query';
import { registerDépôt } from './dépôtEnCours/dépôt.register';
import {
  type ListerDépôtsEnCoursGarantiesFinancièresDependencies,
  registerListerDépôtsEnCoursGarantiesFinancièresQuery,
} from './dépôtEnCours/lister/listerDépôtsEnCoursGarantiesFinancières.query';
import {
  type ConsulterGarantiesFinancièresDependencies,
  registerConsulterGarantiesFinancièresQuery,
} from './garantiesFinancièresActuelles/consulter/consulterGarantiesFinancières.query';
import { registerConsulterArchivesGarantiesFinancièresQuery } from './garantiesFinancièresActuelles/consulterArchives/consulterArchivesGarantiesFinancières.query';
import { registerListerMainlevéesQuery } from './mainlevée/lister/listerMainlevéesGarantiesFinancières.query';
import { registerMainlevée } from './mainlevée/mainlevée.register';
import { registerConsulterProjetAvecGarantiesFinancièresEnAttenteQuery } from './projetEnAttenteDeGarantiesFinancières/consulter/consulterProjetAvecGarantiesFinancièresEnAttente.query';
import { registerListerProjetsAvecGarantiesFinancièresEnAttenteQuery } from './projetEnAttenteDeGarantiesFinancières/lister/listerProjetsAvecGarantiesFinancièresEnAttente.query';

export type GarantiesFinancièresQueryDependencies = ConsulterGarantiesFinancièresDependencies &
  ListerDépôtsEnCoursGarantiesFinancièresDependencies &
  ConsulterDépôtEnCoursGarantiesFinancièresDependencies;

export type GarantiesFinancièresCommandDependencies = {
  loadAggregate: LoadAggregate;
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export const registerGarantiesFinancièresUseCases = ({
  loadAggregate,
  getProjetAggregateRoot,
}: GarantiesFinancièresCommandDependencies) => {
  registerDépôt(loadAggregate, getProjetAggregateRoot);
  registerMainlevée(loadAggregate, getProjetAggregateRoot);
};

export const registerGarantiesFinancièresQueries = (
  dependencies: GarantiesFinancièresQueryDependencies,
) => {
  registerConsulterGarantiesFinancièresQuery(dependencies);
  registerConsulterArchivesGarantiesFinancièresQuery(dependencies);
  registerConsulterProjetAvecGarantiesFinancièresEnAttenteQuery(dependencies);
  registerListerDépôtsEnCoursGarantiesFinancièresQuery(dependencies);
  registerListerProjetsAvecGarantiesFinancièresEnAttenteQuery(dependencies);
  registerConsulterDépôtEnCoursGarantiesFinancièresQuery(dependencies);
  registerListerMainlevéesQuery(dependencies);
};
