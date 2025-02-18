import { LoadAggregate } from '@potentiel-domain/core';

import {
  ConsulterGarantiesFinancièresDependencies,
  registerConsulterGarantiesFinancièresQuery,
} from './garantiesFinancièresActuelles/consulter/consulterGarantiesFinancières.query';
import {
  ListerDépôtsEnCoursGarantiesFinancièresDependencies,
  registerListerDépôtsEnCoursGarantiesFinancièresQuery,
} from './dépôtEnCours/lister/listerDépôtsEnCoursGarantiesFinancières.query';
import { registerListerProjetsAvecGarantiesFinancièresEnAttenteQuery } from './projetEnAttenteDeGarantiesFinancières/lister/listerProjetsAvecGarantiesFinancièresEnAttente.query';
import { registerConsulterProjetAvecGarantiesFinancièresEnAttenteQuery } from './projetEnAttenteDeGarantiesFinancières/consulter/consulterProjetAvecGarantiesFinancièresEnAttente.query';
import {
  ConsulterDépôtEnCoursGarantiesFinancièresDependencies,
  registerConsulterDépôtEnCoursGarantiesFinancièresQuery,
} from './dépôtEnCours/consulter/consulterDépôtEnCoursGarantiesFinancières.query';
import { registerListerMainlevéesQuery } from './mainlevée/lister/listerMainlevéesGarantiesFinancières.query';
import { registerMainlevée } from './mainlevée/mainlevée.register';
import { registerDépôt } from './dépôtEnCours/dépôt.register';
import { registerGarantiesFinancières } from './garantiesFinancièresActuelles/garantiesFinancières.register';
import { registerConsulterArchivesGarantiesFinancièresQuery } from './garantiesFinancièresActuelles/consulterArchives/consulterArchivesGarantiesFinancières.query';
import { registerTâchesPlanifiées } from './tâches-planifiées/tâches-planifiées.register';

export type GarantiesFinancièresQueryDependencies = ConsulterGarantiesFinancièresDependencies &
  ListerDépôtsEnCoursGarantiesFinancièresDependencies &
  ConsulterDépôtEnCoursGarantiesFinancièresDependencies;

export type GarantiesFinancièresCommandDependencies = {
  loadAggregate: LoadAggregate;
};

export const registerGarantiesFinancièresUseCases = ({
  loadAggregate,
}: GarantiesFinancièresCommandDependencies) => {
  registerDépôt(loadAggregate);
  registerGarantiesFinancières(loadAggregate);
  registerMainlevée(loadAggregate);
  registerTâchesPlanifiées(loadAggregate);
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
