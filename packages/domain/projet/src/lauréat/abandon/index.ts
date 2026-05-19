import type {
  ConsulterAbandonQuery,
  ConsulterAbandonReadModel,
} from './consulter/consulterAbandon.query.js';
import type { AccorderAbandonUseCase } from './demande/accorder/accorderAbandon.usecase.js';
import type { AnnulerAbandonUseCase } from './demande/annuler/annulerAbandon.usecase.js';
import type { ConfirmerAbandonUseCase } from './demande/confirmer/confirmerAbandon.usecase.js';
import type {
  ConsulterDemandeAbandonQuery,
  ConsulterDemandeAbandonReadModel,
} from './demande/consulter/consulterDemandeAbandon.query.js';
import type { DemanderAbandonUseCase } from './demande/demander/demanderAbandon.usecase.js';
import type { DemanderConfirmationAbandonUseCase } from './demande/demanderConfirmation/demanderConfirmationAbandon.usecase.js';
import type { PasserEnInstructionAbandonUseCase } from './demande/instruire/passerAbandonEnInstruction.usecase.js';
import type { ListerAbandonsAvecRecandidatureÀRelancerQuery } from './demande/lister/listerAbandonsAvecRecandidatureÀRelancer.query.js';
import type {
  ListerDemandesAbandonQuery,
  ListerDemandesAbandonReadModel,
} from './demande/lister/listerDemandesAbandon.query.js';
import type { RejeterAbandonUseCase } from './demande/rejeter/rejeterAbandon.usecase.js';
import type { DemanderPreuveRecandidatureAbandonUseCase } from './demanderPreuveRecandidature/demanderPreuveRecandidature.usecase.js';
import type {
  HistoriqueAbandonProjetListItemReadModel,
  ListerHistoriqueAbandonProjetQuery,
  ListerHistoriqueAbandonProjetReadModel,
} from './lister/listerHistoriqueAbandonProjet.query.js';
import type { TransmettrePreuveRecandidatureAbandonUseCase } from './transmettrePreuveRecandidature/transmettrePreuveRecandidatureAbandon.usecase.js';

// Query
export type AbandonQuery =
  | ConsulterDemandeAbandonQuery
  | ConsulterAbandonQuery
  | ListerDemandesAbandonQuery
  | ListerAbandonsAvecRecandidatureÀRelancerQuery
  | ListerHistoriqueAbandonProjetQuery;

// ReadModel
export type {
  ConsulterAbandonQuery,
  ConsulterAbandonReadModel,
  ConsulterDemandeAbandonQuery,
  ConsulterDemandeAbandonReadModel,
  HistoriqueAbandonProjetListItemReadModel,
  ListerAbandonsAvecRecandidatureÀRelancerQuery,
  ListerDemandesAbandonQuery,
  ListerDemandesAbandonReadModel,
  ListerHistoriqueAbandonProjetQuery,
  ListerHistoriqueAbandonProjetReadModel,
};

// UseCases
export type AbandonUseCase =
  | DemanderAbandonUseCase
  | AccorderAbandonUseCase
  | DemanderPreuveRecandidatureAbandonUseCase
  | TransmettrePreuveRecandidatureAbandonUseCase
  | DemanderConfirmationAbandonUseCase
  | ConfirmerAbandonUseCase
  | PasserEnInstructionAbandonUseCase
  | AnnulerAbandonUseCase
  | RejeterAbandonUseCase;

export type { AbandonEvent } from './abandon.event.js';
// Events
export type * from './demande/accorder/accorderAbandon.event.js';
export type * from './demande/annuler/annulerAbandon.event.js';
export type * from './demande/confirmer/confirmerAbandon.event.js';
export type * from './demande/demander/demanderAbandon.event.js';
export type * from './demande/demanderConfirmation/demanderConfirmation.event.js';
export type * from './demande/instruire/instruireAbandon.event.js';
export type * from './demande/rejeter/rejeterAbandon.event.js';
export type * from './demanderPreuveRecandidature/demanderPreuveRecandidature.event.js';
export type * from './transmettrePreuveRecandidature/transmettrePreuveRecandidature.event.js';
export type {
  AccorderAbandonUseCase,
  AnnulerAbandonUseCase,
  ConfirmerAbandonUseCase,
  DemanderAbandonUseCase,
  DemanderConfirmationAbandonUseCase,
  DemanderPreuveRecandidatureAbandonUseCase,
  PasserEnInstructionAbandonUseCase,
  RejeterAbandonUseCase,
  TransmettrePreuveRecandidatureAbandonUseCase,
};

// Entity

export type { AbandonEntity } from './abandon.entity.js';
export * as AutoritéCompétente from './autoritéCompétente.valueType.js';
export type { DemandeAbandonEntity } from './demande/demandeAbandon.entity.js';
export * as DocumentAbandon from './documentAbandon.valueType.js';
// ValueTypes
export * as StatutAbandon from './statutAbandon.valueType.js';
export * as StatutPreuveRecandidature from './statutPreuveRecandidature.valueType.js';
