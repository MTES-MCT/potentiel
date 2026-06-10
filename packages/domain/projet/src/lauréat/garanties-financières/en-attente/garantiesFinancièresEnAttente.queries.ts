import type {
  ConsulterGarantiesFinancièresEnAttenteQuery,
  ConsulterGarantiesFinancièresEnAttenteReadModel,
} from './consulter/consulterGarantiesFinancièresEnAttente.query.js';
import type {
  GarantiesFinancièresEnAttenteListItemReadModel,
  ListerGarantiesFinancièresEnAttenteQuery,
  ListerGarantiesFinancièresEnAttenteReadModel,
} from './lister/listerProjetsAvecGarantiesFinancièresEnAttente.query.js';

export type GarantiesFinancièresEnAttenteQuery =
  | ListerGarantiesFinancièresEnAttenteQuery
  | ConsulterGarantiesFinancièresEnAttenteQuery;

export type {
  ConsulterGarantiesFinancièresEnAttenteQuery,
  ConsulterGarantiesFinancièresEnAttenteReadModel,
  GarantiesFinancièresEnAttenteListItemReadModel,
  ListerGarantiesFinancièresEnAttenteQuery,
  ListerGarantiesFinancièresEnAttenteReadModel,
};
