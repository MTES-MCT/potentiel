import {
  ListerProjetsAvecGarantiesFinancièresEnAttenteQuery,
  ListerProjetsAvecGarantiesFinancièresEnAttenteReadModel,
} from './projetEnAttenteDeGarantiesFinancières/lister/listerProjetsAvecGarantiesFinancièresEnAttente.query';
import {
  ConsulterProjetAvecGarantiesFinancièresEnAttenteQuery,
  ConsulterProjetAvecGarantiesFinancièresEnAttenteReadModel,
} from './projetEnAttenteDeGarantiesFinancières/consulter/consulterProjetAvecGarantiesFinancièresEnAttente.query';

// Query
export type GarantiesFinancièresQuery =
  | ConsulterProjetAvecGarantiesFinancièresEnAttenteQuery
  | ListerProjetsAvecGarantiesFinancièresEnAttenteQuery;

export type {
  ConsulterProjetAvecGarantiesFinancièresEnAttenteQuery,
  ListerProjetsAvecGarantiesFinancièresEnAttenteQuery,
};

// ReadModel
export type {
  ConsulterProjetAvecGarantiesFinancièresEnAttenteReadModel,
  ListerProjetsAvecGarantiesFinancièresEnAttenteReadModel,
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

// utils
export * from './_utils/appelOffreSoumisAuxGarantiesFinancières';
