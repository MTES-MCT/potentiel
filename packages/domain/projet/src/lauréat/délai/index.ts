import {
  ConsulterDélaiQuery,
  ConsulterABénéficiéDuDélaiCDC2022Port,
} from './consulter/consulterABénéficiéDuDélaiCDC2022.query';
import {
  ConsulterDemandeDélaiQuery,
  ConsulterDemandeDélaiReadModel,
} from './demande/consulter/consulterDemandeDélai.query';
import { DemanderDélaiUseCase } from './demande/demander/demanderDélai.usecase';
import {
  HistoriqueDélaiProjetListItemReadModel,
  ListerHistoriqueDélaiProjetQuery,
  ListerHistoriqueDélaiProjetReadModel,
  ListerDélaiAccordéProjetPort,
} from './lister/listerHistoriqueDélaiProjet.query';

// Query
export type DélaiQuery =
  | ConsulterDélaiQuery
  | ListerHistoriqueDélaiProjetQuery
  | ConsulterDemandeDélaiQuery;

export { ConsulterDélaiQuery, ListerHistoriqueDélaiProjetQuery, ConsulterDemandeDélaiQuery };

// ReadModel
export type {
  ListerHistoriqueDélaiProjetReadModel,
  HistoriqueDélaiProjetListItemReadModel,
  ConsulterDemandeDélaiReadModel,
};

// UseCases
export type DélaiUseCase = DemanderDélaiUseCase;
export type { DemanderDélaiUseCase };

// Event
export { DélaiDemandéEvent } from './demande/demander/demanderDélai.event';
export * from './délai.event';

// Register
export * from './délai.register';

// Port
export { ConsulterABénéficiéDuDélaiCDC2022Port, ListerDélaiAccordéProjetPort };

// ValueTypes
export * as StatutDemandeDélai from './demande/statutDemandeDélai.valueType';
export * as TypeDocumentDemandeDélai from './demande/typeDocumentDemandeDélai.valueType';

// Entities
export * from './demandeDélai.entity';

// Feature flag
export * from './isFonctionnalitéDélaiActivée';
