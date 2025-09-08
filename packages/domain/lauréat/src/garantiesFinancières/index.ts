import {
  ListerDépôtsEnCoursGarantiesFinancièresQuery,
  ListerDépôtsEnCoursGarantiesFinancièresReadModel,
} from './dépôtEnCours/lister/listerDépôtsEnCoursGarantiesFinancières.query';
import {
  ConsulterGarantiesFinancièresQuery,
  ConsulterGarantiesFinancièresReadModel,
  GarantiesFinancièresReadModel,
} from './garantiesFinancièresActuelles/consulter/consulterGarantiesFinancières.query';
import {
  ListerProjetsAvecGarantiesFinancièresEnAttenteQuery,
  ListerProjetsAvecGarantiesFinancièresEnAttenteReadModel,
} from './projetEnAttenteDeGarantiesFinancières/lister/listerProjetsAvecGarantiesFinancièresEnAttente.query';
import {
  ConsulterProjetAvecGarantiesFinancièresEnAttenteQuery,
  ConsulterProjetAvecGarantiesFinancièresEnAttenteReadModel,
} from './projetEnAttenteDeGarantiesFinancières/consulter/consulterProjetAvecGarantiesFinancièresEnAttente.query';
import {
  ConsulterDépôtEnCoursGarantiesFinancièresQuery,
  ConsulterDépôtEnCoursGarantiesFinancièresReadModel,
} from './dépôtEnCours/consulter/consulterDépôtEnCoursGarantiesFinancières.query';
import { RejeterDemandeMainlevéeGarantiesFinancièresUseCase } from './mainlevée/rejeter/rejeterDemandeMainlevéeGarantiesFinancières.usecase';
import {
  ListerMainlevéeItemReadModel,
  ListerMainlevéesQuery,
  ListerMainlevéesReadModel,
} from './mainlevée/lister/listerMainlevéesGarantiesFinancières.query';
import {
  ConsulterArchivesGarantiesFinancièresQuery,
  ConsulterArchivesGarantiesFinancièresReadModel,
} from './garantiesFinancièresActuelles/consulterArchives/consulterArchivesGarantiesFinancières.query';

// Query
export type GarantiesFinancièresQuery =
  | ConsulterGarantiesFinancièresQuery
  | ConsulterArchivesGarantiesFinancièresQuery
  | ConsulterDépôtEnCoursGarantiesFinancièresQuery
  | ConsulterProjetAvecGarantiesFinancièresEnAttenteQuery
  | ListerDépôtsEnCoursGarantiesFinancièresQuery
  | ListerProjetsAvecGarantiesFinancièresEnAttenteQuery
  | ListerDépôtsEnCoursGarantiesFinancièresQuery
  | ListerMainlevéesQuery;

export type {
  ConsulterGarantiesFinancièresQuery,
  ConsulterArchivesGarantiesFinancièresQuery,
  ConsulterDépôtEnCoursGarantiesFinancièresQuery,
  ConsulterProjetAvecGarantiesFinancièresEnAttenteQuery,
  ListerDépôtsEnCoursGarantiesFinancièresQuery,
  ListerProjetsAvecGarantiesFinancièresEnAttenteQuery,
  ListerMainlevéesQuery,
};

// ReadModel
export type {
  GarantiesFinancièresReadModel,
  ConsulterGarantiesFinancièresReadModel,
  ConsulterArchivesGarantiesFinancièresReadModel,
  ConsulterDépôtEnCoursGarantiesFinancièresReadModel,
  ConsulterProjetAvecGarantiesFinancièresEnAttenteReadModel,
  ListerDépôtsEnCoursGarantiesFinancièresReadModel,
  ListerProjetsAvecGarantiesFinancièresEnAttenteReadModel,
  ListerMainlevéesReadModel,
  ListerMainlevéeItemReadModel,
};

// UseCases
export type GarantiesFinancièresUseCase = RejeterDemandeMainlevéeGarantiesFinancièresUseCase;

export type { RejeterDemandeMainlevéeGarantiesFinancièresUseCase };

// Event

// type global
export type { GarantiesFinancièresEvent } from './garantiesFinancières.aggregate';

// Register
export {
  registerGarantiesFinancièresQueries,
  registerGarantiesFinancièresUseCases,
} from './garantiesFinancières.register';

// ValueTypes
export * as TypeDocumentGarantiesFinancières from './typeDocumentGarantiesFinancières.valueType';
export * as StatutMainlevéeGarantiesFinancières from './mainlevée/statutMainlevéeGarantiesFinancières.valueType';
export * as TypeDocumentRéponseDemandeMainlevée from './mainlevée/typeDocumentRéponseDemandeMainlevée.valueType';
export * as StatutGarantiesFinancières from './garantiesFinancièresActuelles/statutGarantiesFinancières.valueType';
export * as MotifArchivageGarantiesFinancières from './garantiesFinancièresActuelles/motifArchivageGarantiesFinancières.valueType';

// Entities
export * from './garantiesFinancièresActuelles/garantiesFinancièresActuelles.entity';
export * from './garantiesFinancièresActuelles/archivesGarantiesFinancières.entity';
export * from './dépôtEnCours/dépôtEnCoursGarantiesFinancières.entity';
export * from './projetEnAttenteDeGarantiesFinancières/projetAvecGarantiesFinancièresEnAttente.entity';
export * from './mainlevée/mainlevéeGarantiesFinancières.entity';

// utils
export * from './_utils/appelOffreSoumisAuxGarantiesFinancières';
