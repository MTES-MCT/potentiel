import {
  ConsulterDélaiQuery,
  ConsulterABénéficiéDuDélaiCDC2022Port,
} from './consulter/consulterABénéficiéDuDélaiCDC2022.query';
import {
  HistoriqueDélaiProjetListItemReadModel,
  ListerHistoriqueDélaiProjetQuery,
  ListerHistoriqueDélaiProjetReadModel,
  ConsulterDélaiAccordéProjetPort,
} from './lister/listerHistoriqueDélaiProjet.query';

// Query

export type DélaiQuery = ConsulterDélaiQuery | ListerHistoriqueDélaiProjetQuery;

export { ConsulterDélaiQuery, ListerHistoriqueDélaiProjetQuery };

// ReadModel
export type { ListerHistoriqueDélaiProjetReadModel, HistoriqueDélaiProjetListItemReadModel };
// UseCases

// Event

// Register
export * from './délai.register';

// Port
export { ConsulterABénéficiéDuDélaiCDC2022Port, ConsulterDélaiAccordéProjetPort };

// ValueTypes

// Entities
