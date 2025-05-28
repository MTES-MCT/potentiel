import { AnnulerAbandonUseCase } from './annuler/annulerAbandon.usecase';
import { ConfirmerAbandonUseCase } from './confirmer/confirmerAbandon.usecase';
import {
  ConsulterAbandonQuery,
  ConsulterAbandonReadModel,
} from './consulter/consulterAbandon.query';
import { ListerAbandonsQuery, ListerAbandonReadModel } from './lister/listerAbandons.query';
import { RejeterAbandonUseCase } from './rejeter/rejeterAbandon.usecase';
import { ListerAbandonsAvecRecandidatureÀRelancerQuery } from './lister/listerAbandonsAvecRecandidatureÀRelancer.query';
import { PasserEnInstructionAbandonUseCase } from './instruire/passerAbandonEnInstruction.usecase';

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
  | AnnulerAbandonUseCase
  | ConfirmerAbandonUseCase
  | RejeterAbandonUseCase
  | PasserEnInstructionAbandonUseCase;

export type {
  AnnulerAbandonUseCase,
  ConfirmerAbandonUseCase,
  RejeterAbandonUseCase,
  PasserEnInstructionAbandonUseCase,
};

// Register
export { registerAbandonQueries, registerAbandonUseCases } from './abandon.register';

export * as StatutPreuveRecandidature from './statutPreuveRecandidature.valueType';
export * as TypeDocumentAbandon from './typeDocumentAbandon.valueType';

// Entities
export * from './abandon.entity';
