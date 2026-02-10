import {
  ConsulterDépôtGarantiesFinancièresQuery,
  ConsulterDépôtGarantiesFinancièresReadModel,
} from './consulter/consulterDépôtGarantiesFinancières.query.js';
import {
  ListerDépôtsGarantiesFinancièresQuery,
  ListerDépôtsGarantiesFinancièresReadModel,
} from './lister/listerDépôtGarantiesFinancières.query.js';

export type DépôtGarantiesFinancièresQuery =
  | ConsulterDépôtGarantiesFinancièresQuery
  | ListerDépôtsGarantiesFinancièresQuery;

export type { ConsulterDépôtGarantiesFinancièresQuery, ListerDépôtsGarantiesFinancièresQuery };

export type DépôtGarantiesFinancièresReadModel =
  | ConsulterDépôtGarantiesFinancièresReadModel
  | ListerDépôtsGarantiesFinancièresReadModel;

export type {
  ConsulterDépôtGarantiesFinancièresReadModel,
  ListerDépôtsGarantiesFinancièresReadModel,
};
