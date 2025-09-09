import {
  ConsulterGarantiesFinancièresEnAttenteQuery,
  ConsulterGarantiesFinancièresEnAttenteReadModel,
} from './consulter/consulterProjetAvecGarantiesFinancièresEnAttente.query';
import {
  ListerGarantiesFinancièresEnAttenteQuery,
  ListerGarantiesFinancièresEnAttenteReadModel,
} from './lister/listerProjetsAvecGarantiesFinancièresEnAttente.query';

export type GarantiesFinancièresEnAttenteQuery =
  | ConsulterGarantiesFinancièresEnAttenteQuery
  | ListerGarantiesFinancièresEnAttenteQuery;

export { ConsulterGarantiesFinancièresEnAttenteQuery, ListerGarantiesFinancièresEnAttenteQuery };

export type GarantiesFinancièresEnAttenteReadModel =
  | ConsulterGarantiesFinancièresEnAttenteReadModel
  | ListerGarantiesFinancièresEnAttenteReadModel;

export {
  ConsulterGarantiesFinancièresEnAttenteReadModel,
  ListerGarantiesFinancièresEnAttenteReadModel,
};
