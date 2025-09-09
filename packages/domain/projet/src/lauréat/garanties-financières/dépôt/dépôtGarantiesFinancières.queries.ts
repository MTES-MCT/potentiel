import {
  ConsulterDépôtGarantiesFinancièresQuery,
  ConsulterDépôtGarantiesFinancièresReadModel,
} from './consulter/consulterDépôtGarantiesFinancières.query';
import {
  ListerDépôtsGarantiesFinancièresQuery,
  ListerDépôtsGarantiesFinancièresReadModel,
} from './lister/listerDépôtGarantiesFinancières.query';

export type DépôtGarantiesFinancièresQuery =
  | ConsulterDépôtGarantiesFinancièresQuery
  | ListerDépôtsGarantiesFinancièresQuery;

export { ConsulterDépôtGarantiesFinancièresQuery, ListerDépôtsGarantiesFinancièresQuery };

export type DépôtGarantiesFinancièresReadModel =
  | ConsulterDépôtGarantiesFinancièresReadModel
  | ListerDépôtsGarantiesFinancièresReadModel;

export { ConsulterDépôtGarantiesFinancièresReadModel, ListerDépôtsGarantiesFinancièresReadModel };
