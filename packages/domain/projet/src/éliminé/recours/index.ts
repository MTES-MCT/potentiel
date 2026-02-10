import { AccorderRecoursUseCase } from './accorder/accorderRecours.usecase.js';
import { AnnulerRecoursUseCase } from './annuler/annulerRecours.usecase.js';
import {
  ConsulterDemandeRecoursQuery,
  ConsulterDemandeRecoursReadModel,
} from './consulter/consulterDemandeRecours.query.js';
import {
  ConsulterRecoursQuery,
  ConsulterRecoursReadModel,
} from './consulter/consulterRecours.query.js';
import { DemanderRecoursUseCase } from './demander/demanderRecours.usecase.js';
import { PasserEnInstructionRecoursUseCase } from './instruire/passerRecoursEnInstruction.usecase.js';
import {
  ListerDemandeRecoursQuery,
  ListerDemandeRecoursReadModel,
} from './lister/listerDemandeRecours.query.js';
import {
  ListerHistoriqueRecoursProjetQuery,
  HistoriqueRecoursProjetListItemReadModel,
  ListerHistoriqueRecoursProjetReadModel,
} from './listerHistorique/listerHistoriqueRecoursProjet.query.js';
import { RejeterRecoursUseCase } from './rejeter/rejeterRecours.usecase.js';

// Query
export type RecoursQuery =
  | ConsulterDemandeRecoursQuery
  | ConsulterRecoursQuery
  | ListerDemandeRecoursQuery
  | ListerHistoriqueRecoursProjetQuery;

export type {
  ConsulterDemandeRecoursQuery,
  ConsulterRecoursQuery,
  ListerDemandeRecoursQuery,
  ListerHistoriqueRecoursProjetQuery,
};

// ReadModel
export type {
  ConsulterDemandeRecoursReadModel,
  ConsulterRecoursReadModel,
  ListerDemandeRecoursReadModel,
  HistoriqueRecoursProjetListItemReadModel,
  ListerHistoriqueRecoursProjetReadModel,
};

// UseCases
export type RecoursUseCase =
  | AccorderRecoursUseCase
  | AnnulerRecoursUseCase
  | DemanderRecoursUseCase
  | RejeterRecoursUseCase
  | PasserEnInstructionRecoursUseCase;

export type {
  AccorderRecoursUseCase,
  AnnulerRecoursUseCase,
  DemanderRecoursUseCase,
  RejeterRecoursUseCase,
  PasserEnInstructionRecoursUseCase,
};

// Event
export type { RecoursEvent } from './recours.event.js';
export type { RecoursAnnuléEvent } from './annuler/annulerRecours.event.js';
export type { RecoursRejetéEvent } from './rejeter/rejeterRecours.event.js';
export type { RecoursAccordéEvent } from './accorder/recoursAccordé.event.js';
export type { RecoursDemandéEvent } from './demander/demanderRecours.event.js';
export type { RecoursPasséEnInstructionEvent } from './instruire/passerRecoursEnInstruction.event.js';

// Register
export { registerRecoursQueries, registerRecoursUseCases } from './recours.register.js';

// ValueTypes
export * as StatutRecours from './statutRecours.valueType.js';
export * as TypeDocumentRecours from './typeDocumentRecours.valueType.js';

// Entities
export type * from './demandeRecours.entity.js';
export type * from './recours.entity.js';
