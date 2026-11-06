import type { AccorderDemandeDélaiUseCase } from './demande/accorder/accorderDemandeDélai.usecase.js';
import type { AnnulerDemandeDélaiUseCase } from './demande/annuler/annulerDemandeDélai.usecase.js';
import type {
  ConsulterDemandeDélaiQuery,
  ConsulterDemandeDélaiReadModel,
} from './demande/consulter/consulterDemandeDélai.query.js';
import type { CorrigerDemandeDélaiUseCase } from './demande/corriger/corrigerDemandeDélai.usecase.js';
import type { DemanderDélaiUseCase } from './demande/demander/demanderDélai.usecase.js';
import type {
  ListerDemandeDélaiQuery,
  ListerDemandeDélaiReadModel,
} from './demande/lister/listerDemandeDélai.query.js';
import type { PasserEnInstructionDemandeDélaiUseCase } from './demande/passer-en-instruction/passerEnInstructionDemandeDélai.usecase.js';
import type { RejeterDemandeDélaiUseCase } from './demande/rejeter/rejeterDemandeDélai.usecase.js';
import type {
  HistoriqueDélaiProjetListItemReadModel,
  ListerHistoriqueDélaiProjetQuery,
  ListerHistoriqueDélaiProjetReadModel,
} from './lister/listerHistoriqueDélaiProjet.query.js';

// Query
export type DélaiQuery =
  | ListerHistoriqueDélaiProjetQuery
  | ConsulterDemandeDélaiQuery
  | ListerDemandeDélaiQuery;

// ReadModel
export type {
  ConsulterDemandeDélaiQuery,
  ConsulterDemandeDélaiReadModel,
  HistoriqueDélaiProjetListItemReadModel,
  ListerDemandeDélaiQuery,
  ListerDemandeDélaiReadModel,
  ListerHistoriqueDélaiProjetQuery,
  ListerHistoriqueDélaiProjetReadModel,
};

// UseCases
export type DélaiUseCase =
  | DemanderDélaiUseCase
  | AnnulerDemandeDélaiUseCase
  | PasserEnInstructionDemandeDélaiUseCase
  | RejeterDemandeDélaiUseCase
  | AccorderDemandeDélaiUseCase
  | CorrigerDemandeDélaiUseCase;

export * as AutoritéCompétente from './autoritéCompétente.valueType.js';
export type * from './demande/demandeDélai.entity.js';
export * as DocumentDélai from './demande/documentDélai.valueType.js';
export * as MotifDemandeDélai from './demande/motifDemandeDélai.valueType.js';
export * as StatutDemandeDélai from './demande/statutDemandeDélai.valueType.js';
export type * from './délai.event.js';
// Register
export * from './délai.register.js';
export type {
  AccorderDemandeDélaiUseCase,
  AnnulerDemandeDélaiUseCase,
  CorrigerDemandeDélaiUseCase,
  DemanderDélaiUseCase,
  PasserEnInstructionDemandeDélaiUseCase,
  RejeterDemandeDélaiUseCase,
};
