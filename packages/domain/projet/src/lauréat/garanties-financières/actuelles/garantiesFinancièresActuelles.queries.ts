import {
  ArchiveGarantiesFinancièresListItemReadModel,
  ListerArchivesGarantiesFinancièresQuery,
  ListerArchivesGarantiesFinancièresReadModel,
} from './archives/lister/listerArchivesGarantiesFinancières.query.js';
import {
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
  ConsulterGarantiesFinancièresReadModel,
  ListerArchivesGarantiesFinancièresReadModel,
  ArchiveGarantiesFinancièresListItemReadModel,
};
