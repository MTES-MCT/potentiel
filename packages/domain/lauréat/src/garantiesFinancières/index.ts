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

// Query
export type GarantiesFinancièresQuery =
  | ConsulterProjetAvecGarantiesFinancièresEnAttenteQuery
  | ListerProjetsAvecGarantiesFinancièresEnAttenteQuery
  | ListerMainlevéesQuery;

export type {
  ConsulterProjetAvecGarantiesFinancièresEnAttenteQuery,
  ListerProjetsAvecGarantiesFinancièresEnAttenteQuery,
  ListerMainlevéesQuery,
};

// ReadModel
export type {
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

// Entities
export * from './projetEnAttenteDeGarantiesFinancières/projetAvecGarantiesFinancièresEnAttente.entity';
export * from './mainlevée/mainlevéeGarantiesFinancières.entity';

// utils
export * from './_utils/appelOffreSoumisAuxGarantiesFinancières';
