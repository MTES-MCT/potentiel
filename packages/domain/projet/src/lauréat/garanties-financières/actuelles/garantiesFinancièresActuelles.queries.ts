import type {
  ArchiveGarantiesFinancièresListItemReadModel,
  ListerArchivesGarantiesFinancièresQuery,
  ListerArchivesGarantiesFinancièresReadModel,
} from './archives/lister/listerArchivesGarantiesFinancières.query.js';
import type {
  ConsulterGarantiesFinancièresActuellesQuery,
  ConsulterGarantiesFinancièresActuellesReadModel,
} from './consulter/consulterGarantiesFinancièresActuelles.query.js';

export type GarantiesFinancièresActuellesQuery =
  | ConsulterGarantiesFinancièresActuellesQuery
  | ListerArchivesGarantiesFinancièresQuery;

export type {
  ConsulterGarantiesFinancièresActuellesQuery,
  ListerArchivesGarantiesFinancièresQuery,
};

export type GarantiesFinancièresActuellesReadModel =
  | ConsulterGarantiesFinancièresActuellesReadModel
  | ListerArchivesGarantiesFinancièresReadModel
  | ArchiveGarantiesFinancièresListItemReadModel;

export type {
  ArchiveGarantiesFinancièresListItemReadModel,
  ConsulterGarantiesFinancièresActuellesReadModel,
  ListerArchivesGarantiesFinancièresReadModel,
};
