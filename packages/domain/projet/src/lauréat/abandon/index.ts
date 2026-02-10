import { AccorderAbandonUseCase } from './demande/accorder/accorderAbandon.usecase.js';
import { AnnulerAbandonUseCase } from './demande/annuler/annulerAbandon.usecase.js';
import { ConfirmerAbandonUseCase } from './demande/confirmer/confirmerAbandon.usecase.js';
import { DemanderAbandonUseCase } from './demande/demander/demanderAbandon.usecase.js';
import { DemanderConfirmationAbandonUseCase } from './demande/demanderConfirmation/demanderConfirmationAbandon.usecase.js';
import { DemanderPreuveRecandidatureAbandonUseCase } from './demanderPreuveRecandidature/demanderPreuveRecandidature.usecase.js';
import {
  HistoriqueAbandonProjetListItemReadModel,
  ListerHistoriqueAbandonProjetQuery,
  ListerHistoriqueAbandonProjetReadModel,
} from './lister/listerHistoriqueAbandonProjet.query.js';
import { PasserEnInstructionAbandonUseCase } from './demande/instruire/passerAbandonEnInstruction.usecase.js';
import { ListerAbandonsAvecRecandidatureÀRelancerQuery } from './demande/lister/listerAbandonsAvecRecandidatureÀRelancer.query.js';
import { RejeterAbandonUseCase } from './demande/rejeter/rejeterAbandon.usecase.js';
import { TransmettrePreuveRecandidatureAbandonUseCase } from './transmettrePreuveRecandidature/transmettrePreuveRecandidatureAbandon.usecase.js';
import {
  ConsulterDemandeAbandonQuery,
  ConsulterDemandeAbandonReadModel,
} from './demande/consulter/consulterDemandeAbandon.query.js';
import {
  ConsulterAbandonQuery,
  ConsulterAbandonReadModel,
} from './consulter/consulterAbandon.query.js';
import {
  ListerDemandesAbandonQuery,
  ListerDemandesAbandonReadModel,
} from './demande/lister/listerDemandesAbandon.query.js';

// Query
export type AbandonQuery =
  | ConsulterDemandeAbandonQuery
  | ConsulterAbandonQuery
  | ListerDemandesAbandonQuery
  | ListerAbandonsAvecRecandidatureÀRelancerQuery
  | ListerHistoriqueAbandonProjetQuery;

export type {
  ConsulterDemandeAbandonQuery,
  ConsulterAbandonQuery,
  ListerDemandesAbandonQuery,
  ListerAbandonsAvecRecandidatureÀRelancerQuery,
  ListerHistoriqueAbandonProjetQuery,
};

// ReadModel
export type {
  ConsulterDemandeAbandonReadModel,
  ConsulterAbandonReadModel,
  ListerDemandesAbandonReadModel,
  ListerHistoriqueAbandonProjetReadModel,
  HistoriqueAbandonProjetListItemReadModel,
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

export type {
  DemanderAbandonUseCase,
  AccorderAbandonUseCase,
  DemanderPreuveRecandidatureAbandonUseCase,
  TransmettrePreuveRecandidatureAbandonUseCase,
  DemanderConfirmationAbandonUseCase,
  ConfirmerAbandonUseCase,
  PasserEnInstructionAbandonUseCase,
  AnnulerAbandonUseCase,
  RejeterAbandonUseCase,
};

// Events
export type * from './demande/accorder/accorderAbandon.event.js';
export type * from './demande/annuler/annulerAbandon.event.js';
export type * from './demande/demander/demanderAbandon.event.js';
export type * from './demande/rejeter/rejeterAbandon.event.js';
export type * from './demande/instruire/instruireAbandon.event.js';
export type * from './demanderPreuveRecandidature/demanderPreuveRecandidature.event.js';
export type * from './transmettrePreuveRecandidature/transmettrePreuveRecandidature.event.js';
export type * from './demande/demanderConfirmation/demanderConfirmation.event.js';
export type * from './demande/confirmer/confirmerAbandon.event.js';

export type { AbandonEvent } from './abandon.event.js';

// Entity

export type { DemandeAbandonEntity } from './demande/demandeAbandon.entity.js';
export type { AbandonEntity } from './abandon.entity.js';

// ValueTypes
export * as StatutAbandon from './statutAbandon.valueType.js';
export * as TypeDocumentAbandon from './typeDocumentAbandon.valueType.js';
export * as StatutPreuveRecandidature from './statutPreuveRecandidature.valueType.js';
export * as AutoritéCompétente from './autoritéCompétente.valueType.js';
