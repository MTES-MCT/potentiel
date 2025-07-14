import {
  ConsulterDélaiQuery,
  ConsulterABénéficiéDuDélaiCDC2022Port,
} from './consulter/consulterABénéficiéDuDélaiCDC2022.query';
import { AnnulerDemandeDélaiUseCase } from './demande/annuler/annulerDemandeDélai.usecase';
import {
  ConsulterDemandeDélaiQuery,
  ConsulterDemandeDélaiReadModel,
} from './demande/consulter/consulterDemandeDélai.query';
import { DemanderDélaiUseCase } from './demande/demander/demanderDélai.usecase';
import { RejeterDemandeDélaiUseCase } from './demande/rejeter/rejeterDemandeDélai.usecase';
import { PasserEnInstructionDemandeDélaiUseCase } from './demande/passer-en-instruction/passerEnInstructionDemandeDélai.usecase';
import {
  ListerDemandeDélaiQuery,
  ListerDemandeDélaiReadModel,
} from './lister/listerDemandeDélai.query';
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
  | ConsulterDemandeDélaiQuery
  | ListerDemandeDélaiQuery;

export type {
  ConsulterDélaiQuery,
  ListerHistoriqueDélaiProjetQuery,
  ConsulterDemandeDélaiQuery,
  ListerDemandeDélaiQuery,
};

// ReadModel
export type {
  ListerHistoriqueDélaiProjetReadModel,
  HistoriqueDélaiProjetListItemReadModel,
  ConsulterDemandeDélaiReadModel,
  ListerDemandeDélaiReadModel,
};

// UseCases
export type DélaiUseCase =
  | DemanderDélaiUseCase
  | AnnulerDemandeDélaiUseCase
  | RejeterDemandeDélaiUseCase
  | PasserEnInstructionDemandeDélaiUseCase;

export type {
  DemanderDélaiUseCase,
  AnnulerDemandeDélaiUseCase,
  RejeterDemandeDélaiUseCase,
  PasserEnInstructionDemandeDélaiUseCase,
};

// Event
export type { DélaiDemandéEvent } from './demande/demander/demanderDélai.event';
export type { DélaiAccordéEvent } from './demande/accorder/accorderDemandeDélai.event';
export type { DemandeDélaiAnnuléeEvent } from './demande/annuler/annulerDemandeDélai.event';
export type { DemandeDélaiRejetéeEvent } from './demande/rejeter/rejeterDemandeDélai.event';
export type { DemandeDélaiPasséeEnInstructionEvent } from './demande/passer-en-instruction/passerEnInstructionDemandeDélai.event';
export * from './délai.event';

// Register
export * from './délai.register';

// Port
export type { ConsulterABénéficiéDuDélaiCDC2022Port, ListerDélaiAccordéProjetPort };

// ValueTypes
export * as StatutDemandeDélai from './demande/statutDemandeDélai.valueType';
export * as TypeDocumentDemandeDélai from './demande/typeDocumentDemandeDélai.valueType';

// Entities
export * from './demandeDélai.entity';

// Feature flag
export * from './isFonctionnalitéDélaiActivée';
