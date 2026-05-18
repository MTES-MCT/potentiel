import {
  ConsulterMainlevéeEnCoursQuery,
  ConsulterMainlevéeEnCoursReadModel,
} from './consulter/consulterMainlevéeEnCours.query.js';
import {
  ListerMainlevéeItemReadModel,
  ListerMainlevéesQuery,
  ListerMainlevéesReadModel,
} from './lister/listerMainlevéesGarantiesFinancières.query.js';

export type MainlevéeGarantiesFinancièresQuery =
  | ListerMainlevéesQuery
  | ConsulterMainlevéeEnCoursQuery;

export type { ConsulterMainlevéeEnCoursQuery, ListerMainlevéesQuery };

export type MainlevéeGarantiesFinancièresReadModel =
  | ListerMainlevéesReadModel
  | ListerMainlevéeItemReadModel
  | ConsulterMainlevéeEnCoursReadModel;

export type {
  ConsulterMainlevéeEnCoursReadModel,
  ListerMainlevéeItemReadModel,
  ListerMainlevéesReadModel,
};
