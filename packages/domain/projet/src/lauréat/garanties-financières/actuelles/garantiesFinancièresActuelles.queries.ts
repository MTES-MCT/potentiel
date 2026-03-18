import {
  ConsulterGarantiesFinancièresQuery,
  ConsulterGarantiesFinancièresReadModel,
  ArchiveGarantiesFinancièresReadModel,
} from './consulter/consulterGarantiesFinancières.query.js';

export type GarantiesFinancièresActuellesQuery = ConsulterGarantiesFinancièresQuery;

export type { ConsulterGarantiesFinancièresQuery };

export type GarantiesFinancièresActuellesReadModel = ConsulterGarantiesFinancièresReadModel;

export type { ConsulterGarantiesFinancièresReadModel, ArchiveGarantiesFinancièresReadModel };
