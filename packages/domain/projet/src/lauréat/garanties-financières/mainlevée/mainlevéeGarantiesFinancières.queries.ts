import {
  ConsulterMainlevéeEnCoursQuery,
  ConsulterMainlevéeEnCoursReadModel,
} from './consulter/consulterMainlevéeEnCours.query.js';
import {
  ListerMainlevéesQuery,
  ListerMainlevéesReadModel,
  ListerMainlevéeItemReadModel,
} from './lister/listerMainlevéesGarantiesFinancières.query.js';

export type MainlevéeGarantiesFinancièresQuery =
  | ListerMainlevéesQuery
  | ConsulterMainlevéeEnCoursQuery;

export type { ListerMainlevéesQuery, ConsulterMainlevéeEnCoursQuery };

export type MainlevéeGarantiesFinancièresReadModel =
  | ListerMainlevéesReadModel
  | ListerMainlevéeItemReadModel
  | ConsulterMainlevéeEnCoursReadModel;

export type {
  ListerMainlevéesReadModel,
  ListerMainlevéeItemReadModel,
  ConsulterMainlevéeEnCoursReadModel,
};
