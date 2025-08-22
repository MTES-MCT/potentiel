import { AccorderAbandonUseCase } from './accorder/accorderAbandon.usecase';
import { AnnulerAbandonUseCase } from './annuler/annulerAbandon.usecase';
import { ConfirmerAbandonUseCase } from './confirmer/confirmerAbandon.usecase';
import type {
  ConsulterAbandonQuery,
  ConsulterAbandonReadModel,
} from './consulter/consulterAbandon.query';
import { DemanderAbandonUseCase } from './demander/demanderAbandon.usecase';
import { DemanderConfirmationAbandonUseCase } from './demanderConfirmation/demanderConfirmationAbandon.usecase';
import { DemanderPreuveRecandidatureAbandonUseCase } from './demanderPreuveRecandidature/demanderPreuveRecandidature.usecase';
import { PasserEnInstructionAbandonUseCase } from './instruire/passerAbandonEnInstruction.usecase';
import type { ListerAbandonReadModel, ListerAbandonsQuery } from './lister/listerAbandons.query';
import type { ListerAbandonsAvecRecandidatureÀRelancerQuery } from './lister/listerAbandonsAvecRecandidatureÀRelancer.query';
import type {
  HistoriqueAbandonProjetListItemReadModel,
  ListerHistoriqueAbandonProjetQuery,
  ListerHistoriqueAbandonProjetReadModel,
} from './lister/listerHistoriqueAbandonProjet.query';
import { RejeterAbandonUseCase } from './rejeter/rejeterAbandon.usecase';
import { TransmettrePreuveRecandidatureAbandonUseCase } from './transmettrePreuveRecandidature/transmettrePreuveRecandidatureAbandon.usecase';

// Query
export type AbandonQuery =
  | ConsulterAbandonQuery
  | ListerAbandonsQuery
  | ListerAbandonsAvecRecandidatureÀRelancerQuery
  | ListerHistoriqueAbandonProjetQuery;

export type {
  ConsulterAbandonQuery,
  ListerAbandonsQuery,
  ListerAbandonsAvecRecandidatureÀRelancerQuery,
  ListerHistoriqueAbandonProjetQuery,
};

// ReadModel
export type {
  ConsulterAbandonReadModel,
  ListerAbandonReadModel,
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

export {
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

export { AbandonEvent } from './abandon.event';
// Events
export * from './accorder/accorderAbandon.event';
export * from './annuler/annulerAbandon.event';
export * from './confirmer/confirmerAbandon.event';
export * from './demander/demanderAbandon.event';
export * from './demanderConfirmation/demanderConfirmation.event';
export * from './demanderPreuveRecandidature/demanderPreuveRecandidature.event';
export * from './instruire/instruireAbandon.event';
export * from './rejeter/rejeterAbandon.event';
export * from './transmettrePreuveRecandidature/transmettrePreuveRecandidature.event';

// Entity

// Entity

export { AbandonEntity } from './abandon.entity';
export * as AutoritéCompétente from './autoritéCompétente.valueType';
// ValueTypes
export * as StatutAbandon from './statutAbandon.valueType';
export * as StatutPreuveRecandidature from './statutPreuveRecandidature.valueType';
export * as TypeDocumentAbandon from './typeDocumentAbandon.valueType';
