import {
  ListerProjetsAvecGarantiesFinancièresEnAttenteQuery,
  ListerProjetsAvecGarantiesFinancièresEnAttenteReadModel,
} from './projetEnAttenteDeGarantiesFinancières/lister/listerProjetsAvecGarantiesFinancièresEnAttente.query';
import {
  ConsulterProjetAvecGarantiesFinancièresEnAttenteQuery,
  ConsulterProjetAvecGarantiesFinancièresEnAttenteReadModel,
} from './projetEnAttenteDeGarantiesFinancières/consulter/consulterProjetAvecGarantiesFinancièresEnAttente.query';
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
  | ConsulterArchivesGarantiesFinancièresQuery
  | ConsulterProjetAvecGarantiesFinancièresEnAttenteQuery
  | ListerProjetsAvecGarantiesFinancièresEnAttenteQuery
  | ListerMainlevéesQuery;

export type {
  ConsulterArchivesGarantiesFinancièresQuery,
  ConsulterProjetAvecGarantiesFinancièresEnAttenteQuery,
  ListerProjetsAvecGarantiesFinancièresEnAttenteQuery,
  ListerMainlevéesQuery,
};

// ReadModel
export type {
  ConsulterArchivesGarantiesFinancièresReadModel,
  ConsulterProjetAvecGarantiesFinancièresEnAttenteReadModel,
  ListerProjetsAvecGarantiesFinancièresEnAttenteReadModel,
  ListerMainlevéesReadModel,
  ListerMainlevéeItemReadModel,
};

// UseCases

// Event

// type global
export type { GarantiesFinancièresEvent } from './garantiesFinancières.aggregate';

// Register
export { registerGarantiesFinancièresQueries } from './garantiesFinancières.register';

// ValueTypes
export * as TypeDocumentGarantiesFinancières from './typeDocumentGarantiesFinancières.valueType';
export * as StatutMainlevéeGarantiesFinancières from './mainlevée/statutMainlevéeGarantiesFinancières.valueType';
export * as TypeDocumentRéponseDemandeMainlevée from './mainlevée/typeDocumentRéponseDemandeMainlevée.valueType';
export * as MotifArchivageGarantiesFinancières from './garantiesFinancièresActuelles/motifArchivageGarantiesFinancières.valueType';

// Entities
export * from './garantiesFinancièresActuelles/archivesGarantiesFinancières.entity';
export * from './projetEnAttenteDeGarantiesFinancières/projetAvecGarantiesFinancièresEnAttente.entity';
export * from './mainlevée/mainlevéeGarantiesFinancières.entity';

// utils
export * from './_utils/appelOffreSoumisAuxGarantiesFinancières';
