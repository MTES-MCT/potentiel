import { AccorderAbandonUseCase } from './demande/accorder/accorderAbandon.usecase';
import { AnnulerAbandonUseCase } from './demande/annuler/annulerAbandon.usecase';
import { ConfirmerAbandonUseCase } from './demande/confirmer/confirmerAbandon.usecase';
import { DemanderAbandonUseCase } from './demande/demander/demanderAbandon.usecase';
import { DemanderConfirmationAbandonUseCase } from './demande/demanderConfirmation/demanderConfirmationAbandon.usecase';
import { DemanderPreuveRecandidatureAbandonUseCase } from './demanderPreuveRecandidature/demanderPreuveRecandidature.usecase';
import {
  HistoriqueAbandonProjetListItemReadModel,
  ListerHistoriqueAbandonProjetQuery,
  ListerHistoriqueAbandonProjetReadModel,
} from './lister/listerHistoriqueAbandonProjet.query';
import { PasserEnInstructionAbandonUseCase } from './demande/instruire/passerAbandonEnInstruction.usecase';
import { ListerAbandonsAvecRecandidatureÀRelancerQuery } from './demande/lister/listerAbandonsAvecRecandidatureÀRelancer.query';
import { RejeterAbandonUseCase } from './demande/rejeter/rejeterAbandon.usecase';
import { TransmettrePreuveRecandidatureAbandonUseCase } from './transmettrePreuveRecandidature/transmettrePreuveRecandidatureAbandon.usecase';
import {
  ConsulterDemandeAbandonQuery,
  ConsulterDemandeAbandonReadModel,
} from './demande/consulter/consulterDemandeAbandon.query';
import {
  ConsulterAbandonQuery,
  ConsulterAbandonReadModel,
} from './consulter/consulterAbandon.query';
import {
  ListerDemandesAbandonQuery,
  ListerDemandesAbandonReadModel,
} from './demande/lister/listerDemandesAbandon.query';

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

// Events
export * from './demande/accorder/accorderAbandon.event';
export * from './demande/annuler/annulerAbandon.event';
export * from './demande/demander/demanderAbandon.event';
export * from './demande/rejeter/rejeterAbandon.event';
export * from './demande/instruire/instruireAbandon.event';
export * from './demanderPreuveRecandidature/demanderPreuveRecandidature.event';
export * from './transmettrePreuveRecandidature/transmettrePreuveRecandidature.event';
export * from './demande/demanderConfirmation/demanderConfirmation.event';
export * from './demande/confirmer/confirmerAbandon.event';

export { AbandonEvent } from './abandon.event';

// Entity

export { DemandeAbandonEntity } from './demande/demandeAbandon.entity';
export { AbandonEntity } from './abandon.entity';

// ValueTypes
export * as StatutAbandon from './statutAbandon.valueType';
export * as TypeDocumentAbandon from './typeDocumentAbandon.valueType';
export * as StatutPreuveRecandidature from './statutPreuveRecandidature.valueType';
export * as AutoritéCompétente from './autoritéCompétente.valueType';
