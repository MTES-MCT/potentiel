import { AccorderAbandonUseCase } from './accorder/accorderAbandon.usecase';
import { AnnulerAbandonUseCase } from './annuler/annulerAbandon.usecase';
import { ConfirmerAbandonUseCase } from './confirmer/confirmerAbandon.usecase';
import {
  ConsulterAbandonQuery,
  ConsulterAbandonReadModel,
} from './consulter/consulterAbandon.query';
import { DemanderAbandonUseCase } from './demander/demanderAbandon.usecase';
import { DemanderConfirmationAbandonUseCase } from './demanderConfirmation/demanderConfirmationAbandon.usecase';
import { ListerAbandonsQuery, ListerAbandonReadModel } from './lister/listerAbandons.query';
import { RejeterAbandonUseCase } from './rejeter/rejeterAbandon.usecase';
import { DemanderPreuveRecandidatureAbandonUseCase } from './demanderPreuveRecandidature/demanderPreuveRecandidatureAbandon.usecase';
import { TransmettrePreuveRecandidatureAbandonUseCase } from './transmettre/transmettrePreuveRecandidatureAbandon.usecase';
import { ListerAbandonsAvecRecandidatureÀRelancerQuery } from './lister/listerAbandonsAvecRecandidatureÀRelancer.query';

// Query
export type AbandonQuery =
  | ConsulterAbandonQuery
  | ListerAbandonsQuery
  | ListerAbandonsAvecRecandidatureÀRelancerQuery;

export type {
  ConsulterAbandonQuery,
  ListerAbandonsQuery,
  ListerAbandonsAvecRecandidatureÀRelancerQuery,
};

// ReadModel
export type { ConsulterAbandonReadModel, ListerAbandonReadModel };

// UseCases
export type AbandonUseCase =
  | AccorderAbandonUseCase
  | AnnulerAbandonUseCase
  | ConfirmerAbandonUseCase
  | DemanderAbandonUseCase
  | DemanderConfirmationAbandonUseCase
  | RejeterAbandonUseCase
  | TransmettrePreuveRecandidatureAbandonUseCase
  | DemanderPreuveRecandidatureAbandonUseCase;

export type {
  AccorderAbandonUseCase,
  AnnulerAbandonUseCase,
  ConfirmerAbandonUseCase,
  DemanderAbandonUseCase,
  DemanderConfirmationAbandonUseCase,
  RejeterAbandonUseCase,
};

// Event
export type { AbandonEvent } from './abandon.aggregate';
export type { AbandonAnnuléEvent } from './annuler/annulerAbandon.behavior';
export type {
  AbandonDemandéEventV1,
  AbandonDemandéEvent,
} from './demander/demanderAbandon.behavior';
export type { ConfirmationAbandonDemandéeEvent } from './demanderConfirmation/demanderConfirmationAbandon.behavior';
export type { AbandonConfirméEvent } from './confirmer/confirmerAbandon.behavior';
export type { AbandonRejetéEvent } from './rejeter/rejeterAbandon.behavior';
export type { AbandonAccordéEvent } from './accorder/accorderAbandon.behavior';
export type { PreuveRecandidatureDemandéeEvent } from './demanderPreuveRecandidature/demanderPreuveRecandidatureAbandon.behavior';
export type { PreuveRecandidatureTransmiseEvent } from './transmettre/transmettrePreuveRecandidatureAbandon.behavior';

// Register
export { registerAbandonQueries, registerAbandonUseCases } from './abandon.register';

// ValueTypes
export * as StatutAbandon from './statutAbandon.valueType';
export * as StatutPreuveRecandidature from './statutPreuveRecandidature.valueType';
export * as Abandon from './abandon.valueType';
export * as TypeDocumentAbandon from './typeDocumentAbandon.valueType';

// Entities
export * from './abandon.entity';

// Aggregate
export { loadAbandonFactory } from './abandon.aggregate';
