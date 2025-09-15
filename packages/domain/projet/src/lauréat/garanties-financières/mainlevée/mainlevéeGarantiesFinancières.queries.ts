import {
  ConsulterMainlevéeEnCoursQuery,
  ConsulterMainlevéeEnCoursReadModel,
} from './consulter/consulterMainlevéeEnCours.query';
import {
  ListerMainlevéesQuery,
  ListerMainlevéesReadModel,
  ListerMainlevéeItemReadModel,
} from './lister/listerMainlevéesGarantiesFinancières.query';

export type MainlevéeGarantiesFinancièresQuery =
  | ListerMainlevéesQuery
  | ConsulterMainlevéeEnCoursQuery;

export { ListerMainlevéesQuery, ConsulterMainlevéeEnCoursQuery };

export type MainlevéeGarantiesFinancièresReadModel =
  | ListerMainlevéesReadModel
  | ListerMainlevéeItemReadModel
  | ConsulterMainlevéeEnCoursReadModel;

export {
  ListerMainlevéesReadModel,
  ListerMainlevéeItemReadModel,
  ConsulterMainlevéeEnCoursReadModel,
};
