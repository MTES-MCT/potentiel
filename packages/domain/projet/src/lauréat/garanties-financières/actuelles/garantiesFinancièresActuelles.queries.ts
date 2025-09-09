import {
  ConsulterArchivesGarantiesFinancièresQuery,
  ConsulterArchivesGarantiesFinancièresReadModel,
} from './archives/consulter/consulterArchivesGarantiesFinancières.query';
import {
  ConsulterGarantiesFinancièresQuery,
  ConsulterGarantiesFinancièresReadModel,
  DétailsGarantiesFinancièresReadModel,
} from './consulter/consulterGarantiesFinancières.query';

export type GarantiesFinancièresActuellesQuery =
  | ConsulterGarantiesFinancièresQuery
  | ConsulterArchivesGarantiesFinancièresQuery;

export { ConsulterGarantiesFinancièresQuery, ConsulterArchivesGarantiesFinancièresQuery };

export type GarantiesFinancièresActuellesReadModel =
  | ConsulterGarantiesFinancièresReadModel
  | ConsulterArchivesGarantiesFinancièresReadModel;

export {
  ConsulterGarantiesFinancièresReadModel,
  ConsulterArchivesGarantiesFinancièresReadModel,
  DétailsGarantiesFinancièresReadModel,
};
