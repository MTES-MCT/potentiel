import {
  ConsulterGarantiesFinancièresEnAttenteQuery,
  ConsulterGarantiesFinancièresEnAttenteReadModel,
} from './consulter/consulterProjetAvecGarantiesFinancièresEnAttente.query';
import {
  ListerGarantiesFinancièresEnAttenteQuery,
  ListerGarantiesFinancièresEnAttenteReadModel,
  GarantiesFinancièresEnAttenteListItemReadModel,
} from './lister/listerProjetsAvecGarantiesFinancièresEnAttente.query';

export type GarantiesFinancièresEnAttenteQuery =
  | ConsulterGarantiesFinancièresEnAttenteQuery
  | ListerGarantiesFinancièresEnAttenteQuery;

export { ConsulterGarantiesFinancièresEnAttenteQuery, ListerGarantiesFinancièresEnAttenteQuery };

export {
  ConsulterGarantiesFinancièresEnAttenteReadModel,
  ListerGarantiesFinancièresEnAttenteReadModel,
  GarantiesFinancièresEnAttenteListItemReadModel,
};
