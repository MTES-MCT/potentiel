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
import {
  ConsulterHistoriqueDemandeMainlevéeRejetéeGarantiesFinancièresDependencies,
  registerConsulterHistoriqueDemandeMainlevéeRejetéeGarantiesFinancièresQuery,
} from './mainlevée/consulter/consulterHistoriqueDemandeMainlevéeRejetéeGarantiesFinancières.query';
import { registerMainlevée } from './mainlevée/mainlevée.register';
import { registerDépôt } from './dépôtEnCours/dépôt.register';
import { registerGarantiesFinancières } from './garantiesFinancièresActuelles/garantiesFinancières.register';
import { registerConsulterArchivesGarantiesFinancièresQuery } from './garantiesFinancièresActuelles/consulterArchives/consulterArchivesGarantiesFinancières.query';
import {
  ConsulterDemandeEnCoursMainlevéeGarantiesFinancièresDependencies,
  registerConsulterDemandeEnCoursMainlevéeGarantiesFinancièresQuery,
} from './mainlevée/consulter/consulterDemandeEnCoursMainlevéeGarantiesFinancières.query';

export type GarantiesFinancièresQueryDependencies = ConsulterGarantiesFinancièresDependencies &
  ListerDépôtsEnCoursGarantiesFinancièresDependencies &
  ConsulterDépôtEnCoursGarantiesFinancièresDependencies &
  ConsulterDemandeEnCoursMainlevéeGarantiesFinancièresDependencies &
  ConsulterHistoriqueDemandeMainlevéeRejetéeGarantiesFinancièresDependencies;

export type GarantiesFinancièresCommandDependencies = {
  loadAggregate: LoadAggregate;
};

export const registerGarantiesFinancièresUseCases = ({
  loadAggregate,
}: GarantiesFinancièresCommandDependencies) => {
  registerDépôt(loadAggregate);
  registerGarantiesFinancières(loadAggregate);
  registerMainlevée(loadAggregate);
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
  registerConsulterDemandeEnCoursMainlevéeGarantiesFinancièresQuery(dependencies);
  registerListerMainlevéesQuery(dependencies);
  registerConsulterHistoriqueDemandeMainlevéeRejetéeGarantiesFinancièresQuery(dependencies);
};
