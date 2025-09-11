import {
  ConsulterMainlevéeEnCoursQuery,
  ConsulterMainlevéeEnCoursReadModel,
} from './consulter/consulterMainlevéeEnCours.query';
import {
  ListerMainlevéesQuery,
  ListerMainlevéesReadModel,
} from './lister/listerMainlevéesGarantiesFinancières.query';

export type MainlevéeGarantiesFinancièresQuery =
  | ListerMainlevéesQuery
  | ConsulterMainlevéeEnCoursQuery;

export { ListerMainlevéesQuery, ConsulterMainlevéeEnCoursQuery };

export type MainlevéeGarantiesFinancièresReadModel =
  | ListerMainlevéesReadModel
  | ConsulterMainlevéeEnCoursReadModel;

export { ListerMainlevéesReadModel, ConsulterMainlevéeEnCoursReadModel };
