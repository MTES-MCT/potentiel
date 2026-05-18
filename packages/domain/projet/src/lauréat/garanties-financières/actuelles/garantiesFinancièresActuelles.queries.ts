import type {
  ArchiveGarantiesFinancièresListItemReadModel,
  ListerArchivesGarantiesFinancièresQuery,
  ListerArchivesGarantiesFinancièresReadModel,
} from './archives/lister/listerArchivesGarantiesFinancières.query.js';
import type {
  ConsulterGarantiesFinancièresQuery,
  ConsulterGarantiesFinancièresReadModel,
} from './consulter/consulterGarantiesFinancières.query.js';

export type GarantiesFinancièresActuellesQuery =
  | ConsulterGarantiesFinancièresQuery
  | ListerArchivesGarantiesFinancièresQuery;

export type { ConsulterGarantiesFinancièresQuery, ListerArchivesGarantiesFinancièresQuery };

export type GarantiesFinancièresActuellesReadModel =
  | ConsulterGarantiesFinancièresReadModel
  | ListerArchivesGarantiesFinancièresReadModel
  | ArchiveGarantiesFinancièresListItemReadModel;

export type {
  ArchiveGarantiesFinancièresListItemReadModel,
  ConsulterGarantiesFinancièresReadModel,
  ListerArchivesGarantiesFinancièresReadModel,
};
