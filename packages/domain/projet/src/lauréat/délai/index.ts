import type {
  ConsulterABénéficiéDuDélaiCDC2022Port,
  ConsulterDélaiQuery,
} from './consulter/consulterABénéficiéDuDélaiCDC2022.query';
import type { AccorderDemandeDélaiUseCase } from './demande/accorder/accorderDemandeDélai.usecase';
import type { AnnulerDemandeDélaiUseCase } from './demande/annuler/annulerDemandeDélai.usecase';
import type {
  ConsulterDemandeDélaiQuery,
  ConsulterDemandeDélaiReadModel,
} from './demande/consulter/consulterDemandeDélai.query';
import type { CorrigerDemandeDélaiUseCase } from './demande/corriger/corrigerDemandeDélai.usecase';
import type { DemanderDélaiUseCase } from './demande/demander/demanderDélai.usecase';
import type { PasserEnInstructionDemandeDélaiUseCase } from './demande/passer-en-instruction/passerEnInstructionDemandeDélai.usecase';
import type { RejeterDemandeDélaiUseCase } from './demande/rejeter/rejeterDemandeDélai.usecase';
import type {
  ListerDemandeDélaiQuery,
  ListerDemandeDélaiReadModel,
} from './lister/listerDemandeDélai.query';
import type {
  HistoriqueDélaiProjetListItemReadModel,
  ListerHistoriqueDélaiProjetQuery,
  ListerHistoriqueDélaiProjetReadModel,
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
  | PasserEnInstructionDemandeDélaiUseCase
  | RejeterDemandeDélaiUseCase
  | AccorderDemandeDélaiUseCase
  | CorrigerDemandeDélaiUseCase;

export type {
  DemanderDélaiUseCase,
  AnnulerDemandeDélaiUseCase,
  PasserEnInstructionDemandeDélaiUseCase,
  RejeterDemandeDélaiUseCase,
  AccorderDemandeDélaiUseCase,
  CorrigerDemandeDélaiUseCase,
};

export type { DélaiAccordéEvent, LegacyDélaiAccordéEvent } from './accorder/accorderDélai.event';
export type { DemandeDélaiAnnuléeEvent } from './demande/annuler/annulerDemandeDélai.event';
export type { DemandeDélaiCorrigéeEvent } from './demande/corriger/corrigerDemandeDélai.event';
// Event
export type { DélaiDemandéEvent } from './demande/demander/demanderDélai.event';
export type { DemandeDélaiPasséeEnInstructionEvent } from './demande/passer-en-instruction/passerEnInstructionDemandeDélai.event';
export type { DemandeDélaiRejetéeEvent } from './demande/rejeter/rejeterDemandeDélai.event';
export type { DemandeDélaiSuppriméeEvent } from './demande/supprimer/supprimerDemandeDélai.event';
export * from './délai.event';
// Register
export * from './délai.register';

// Port
export type { ConsulterABénéficiéDuDélaiCDC2022Port };

// Entities
export * from './demande/demandeDélai.entity';
// ValueTypes
export * as StatutDemandeDélai from './demande/statutDemandeDélai.valueType';
export * as TypeDocumentDemandeDélai from './demande/typeDocumentDemandeDélai.valueType';
