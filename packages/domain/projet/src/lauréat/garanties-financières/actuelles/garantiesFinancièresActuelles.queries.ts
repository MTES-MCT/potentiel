import {
  ArchiveGarantiesFinancièresListItemReadModel,
  ListerArchivesGarantiesFinancièresQuery,
  ListerArchivesGarantiesFinancièresReadModel,
} from './archives/lister/listerArchivesGarantiesFinancières.query';
import {
  ConsulterGarantiesFinancièresQuery,
  ConsulterGarantiesFinancièresReadModel,
} from './consulter/consulterGarantiesFinancières.query';

export type GarantiesFinancièresActuellesQuery =
  | ConsulterGarantiesFinancièresQuery
  | ListerArchivesGarantiesFinancièresQuery;

export { ConsulterGarantiesFinancièresQuery, ListerArchivesGarantiesFinancièresQuery };

export type GarantiesFinancièresActuellesReadModel =
  | ConsulterGarantiesFinancièresReadModel
  | ListerArchivesGarantiesFinancièresReadModel
  | ArchiveGarantiesFinancièresListItemReadModel;

export {
  ConsulterGarantiesFinancièresReadModel,
  ListerArchivesGarantiesFinancièresReadModel,
  ArchiveGarantiesFinancièresListItemReadModel,
};
