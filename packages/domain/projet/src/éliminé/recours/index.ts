/** biome-ignore-all assist/source/organizeImports: organized by hand for this index */

import type { AccorderRecoursUseCase } from './accorder/accorderRecours.usecase.js';
import type { AnnulerRecoursUseCase } from './annuler/annulerRecours.usecase.js';
import type {
  ConsulterDemandeRecoursQuery,
  ConsulterDemandeRecoursReadModel,
} from './consulter/consulterDemandeRecours.query.js';
import type {
  ConsulterRecoursQuery,
  ConsulterRecoursReadModel,
} from './consulter/consulterRecours.query.js';
import type { DemanderRecoursUseCase } from './demander/demanderRecours.usecase.js';
import type { PasserEnInstructionRecoursUseCase } from './instruire/passerRecoursEnInstruction.usecase.js';
import type {
  ListerDemandeRecoursQuery,
  ListerDemandeRecoursReadModel,
} from './lister/listerDemandeRecours.query.js';
import type {
  HistoriqueRecoursProjetListItemReadModel,
  ListerHistoriqueRecoursProjetQuery,
  ListerHistoriqueRecoursProjetReadModel,
} from './listerHistorique/listerHistoriqueRecoursProjet.query.js';
import type { RejeterRecoursUseCase } from './rejeter/rejeterRecours.usecase.js';

// Query
export type RecoursQuery =
  | ConsulterDemandeRecoursQuery
  | ConsulterRecoursQuery
  | ListerDemandeRecoursQuery
  | ListerHistoriqueRecoursProjetQuery;

// ReadModel
export type {
  ConsulterDemandeRecoursQuery,
  ConsulterDemandeRecoursReadModel,
  ConsulterRecoursQuery,
  ConsulterRecoursReadModel,
  HistoriqueRecoursProjetListItemReadModel,
  ListerDemandeRecoursQuery,
  ListerDemandeRecoursReadModel,
  ListerHistoriqueRecoursProjetQuery,
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
  PasserEnInstructionRecoursUseCase,
  RejeterRecoursUseCase,
};

// Entities
export type * from './demandeRecours.entity.js';
export type * from './recours.entity.js';

// Event
export type {
  RecoursAccordéEvent,
  RecoursAccordéV1Event,
} from './accorder/recoursAccordé.event.js';
export type { RecoursAnnuléEvent } from './annuler/annulerRecours.event.js';
export type { RecoursDemandéEvent } from './demander/demanderRecours.event.js';
export type { RecoursPasséEnInstructionEvent } from './instruire/passerRecoursEnInstruction.event.js';
export type { RecoursEvent } from './recours.event.js';
export type { RecoursRejetéEvent } from './rejeter/rejeterRecours.event.js';

// Register
export { registerRecoursQueries, registerRecoursUseCases } from './recours.register.js';

// ValueTypes
export * as AutoritéCompétente from './autoritéCompétente.valueType.js';
export * as DocumentRecours from './documentRecours.valueType.js';
export * as StatutRecours from './statutRecours.valueType.js';
