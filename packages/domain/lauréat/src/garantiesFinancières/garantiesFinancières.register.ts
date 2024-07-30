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
import {
  ConsulterDemandeMainlevéeGarantiesFinancièresDependencies,
  registerConsulterDemandeMainlevéeGarantiesFinancièresQuery,
} from './mainlevée/consulter/consulterDemandeMainlevéeGarantiesFinancières.query';
import { registerListerDemandeMainlevéeQuery } from './mainlevée/lister/listerDemandeMainlevéeGarantiesFinancières.query';
import {
  ConsulterHistoriqueDemandeMainlevéeRejetéeGarantiesFinancièresDependencies,
  registerConsulterHistoriqueDemandeMainlevéeRejetéeGarantiesFinancièresQuery,
} from './mainlevée/consulter/consulterHistoriqueDemandeMainlevéeRejetéeGarantiesFinancières.query';
import { registerMainlevée } from './mainlevée/mainlevée.register';
import { registerDépôt } from './dépôtEnCours/dépôt.register';
import { registerGarantiesFinancières } from './garantiesFinancièresActuelles/garantiesFinancières.register';
import { registerConsulterArchivesGarantiesFinancièresQuery } from './garantiesFinancièresActuelles/consulterArchives/consulterArchivesGarantiesFinancières.query';

export type GarantiesFinancièresQueryDependencies = ConsulterGarantiesFinancièresDependencies &
  ListerDépôtsEnCoursGarantiesFinancièresDependencies &
  ConsulterDépôtEnCoursGarantiesFinancièresDependencies &
  ConsulterDemandeMainlevéeGarantiesFinancièresDependencies &
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
  registerConsulterDemandeMainlevéeGarantiesFinancièresQuery(dependencies);
  registerListerDemandeMainlevéeQuery(dependencies);
  registerConsulterHistoriqueDemandeMainlevéeRejetéeGarantiesFinancièresQuery(dependencies);
};
