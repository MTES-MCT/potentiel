import {
  ArchiveGarantiesFinancièresListItemReadModel,
  ConsulterArchivesGarantiesFinancièresQuery,
  ConsulterArchivesGarantiesFinancièresReadModel,
} from './archives/consulter/consulterArchivesGarantiesFinancières.query.js';
import {
  ConsulterGarantiesFinancièresQuery,
  ConsulterGarantiesFinancièresReadModel,
} from './consulter/consulterGarantiesFinancières.query.js';

export type GarantiesFinancièresActuellesQuery =
  | ConsulterGarantiesFinancièresQuery
  | ConsulterArchivesGarantiesFinancièresQuery;

export type { ConsulterGarantiesFinancièresQuery, ConsulterArchivesGarantiesFinancièresQuery };

export type GarantiesFinancièresActuellesReadModel =
  | ConsulterGarantiesFinancièresReadModel
  | ConsulterArchivesGarantiesFinancièresReadModel
  | ArchiveGarantiesFinancièresListItemReadModel;

export type {
  ConsulterGarantiesFinancièresReadModel,
  ConsulterArchivesGarantiesFinancièresReadModel,
  ArchiveGarantiesFinancièresListItemReadModel,
};
