import { AccorderDemandeDélaiUseCase } from './demande/accorder/accorderDemandeDélai.usecase.js';
import { AnnulerDemandeDélaiUseCase } from './demande/annuler/annulerDemandeDélai.usecase.js';
import {
  ConsulterDemandeDélaiQuery,
  ConsulterDemandeDélaiReadModel,
} from './demande/consulter/consulterDemandeDélai.query.js';
import { DemanderDélaiUseCase } from './demande/demander/demanderDélai.usecase.js';
import { RejeterDemandeDélaiUseCase } from './demande/rejeter/rejeterDemandeDélai.usecase.js';
import { PasserEnInstructionDemandeDélaiUseCase } from './demande/passer-en-instruction/passerEnInstructionDemandeDélai.usecase.js';
import {
  HistoriqueDélaiProjetListItemReadModel,
  ListerHistoriqueDélaiProjetQuery,
  ListerHistoriqueDélaiProjetReadModel,
} from './lister/listerHistoriqueDélaiProjet.query.js';
import { CorrigerDemandeDélaiUseCase } from './demande/corriger/corrigerDemandeDélai.usecase.js';
import {
  ListerDemandeDélaiQuery,
  ListerDemandeDélaiReadModel,
} from './demande/lister/listerDemandeDélai.query.js';

// Query
export type DélaiQuery =
  | ListerHistoriqueDélaiProjetQuery
  | ConsulterDemandeDélaiQuery
  | ListerDemandeDélaiQuery;

export type {
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

// Event
export type { DélaiDemandéEvent } from './demande/demander/demanderDélai.event.js';
export type { DemandeDélaiCorrigéeEvent } from './demande/corriger/corrigerDemandeDélai.event.js';
export type { DemandeDélaiAnnuléeEvent } from './demande/annuler/annulerDemandeDélai.event.js';
export type { DemandeDélaiPasséeEnInstructionEvent } from './demande/passer-en-instruction/passerEnInstructionDemandeDélai.event.js';
export type { DemandeDélaiRejetéeEvent } from './demande/rejeter/rejeterDemandeDélai.event.js';
export type { DélaiAccordéEvent } from './accorder/accorderDélai.event.js';
export type { DemandeDélaiSuppriméeEvent } from './demande/supprimer/supprimerDemandeDélai.event.js';
export type * from './délai.event.js';

// Register
export * from './délai.register.js';

// ValueTypes
export * as StatutDemandeDélai from './demande/statutDemandeDélai.valueType.js';
export * as TypeDocumentDemandeDélai from './demande/typeDocumentDemandeDélai.valueType.js';
export * as AutoritéCompétente from './autoritéCompétente.valueType.js';

// Entities
export type * from './demande/demandeDélai.entity.js';
