import {
  ConsulterGarantiesFinancièresEnAttenteQuery,
  ConsulterGarantiesFinancièresEnAttenteReadModel,
} from './consulter/consulterProjetAvecGarantiesFinancièresEnAttente.query.js';
import {
  ListerGarantiesFinancièresEnAttenteQuery,
  ListerGarantiesFinancièresEnAttenteReadModel,
  GarantiesFinancièresEnAttenteListItemReadModel,
} from './lister/listerProjetsAvecGarantiesFinancièresEnAttente.query.js';

export type GarantiesFinancièresEnAttenteQuery =
  | ConsulterGarantiesFinancièresEnAttenteQuery
  | ListerGarantiesFinancièresEnAttenteQuery;

export type {
  ConsulterGarantiesFinancièresEnAttenteQuery,
  ListerGarantiesFinancièresEnAttenteQuery,
};

export type {
  ConsulterGarantiesFinancièresEnAttenteReadModel,
  ListerGarantiesFinancièresEnAttenteReadModel,
  GarantiesFinancièresEnAttenteListItemReadModel,
};
