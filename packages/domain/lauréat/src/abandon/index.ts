import { AccorderAbandonUseCase } from './accorder/accorderAbandon.usecase';
import { AnnulerAbandonUseCase } from './annuler/annulerAbandon.usecase';
import { AnnulerRejetAbandonUseCase } from './annuler/annulerRejetAbandon.usecase';
import { ConfirmerAbandonUseCase } from './confirmer/confirmerAbandon.usecase';
import {
  ConsulterAbandonQuery,
  ConsulterAbandonReadModel,
} from './consulter/consulterAbandon.query';
import { DemanderAbandonUseCase } from './demander/demanderAbandon.usecase';
import { DemanderConfirmationAbandonUseCase } from './demander/demanderConfirmationAbandon.usecase';
import { ListerAbandonsQuery } from './lister/listerAbandon.query';
import { RejeterAbandonUseCase } from './rejeter/rejeterAbandon.usecase';

// Query
export type AbandonQuery = ConsulterAbandonQuery | ListerAbandonsQuery;

export { ConsulterAbandonQuery, ListerAbandonsQuery };

// ReadModel
export { ConsulterAbandonReadModel };

// UseCases
export type AbandonUseCase =
  | AccorderAbandonUseCase
  | AnnulerAbandonUseCase
  | AnnulerRejetAbandonUseCase
  | ConfirmerAbandonUseCase
  | DemanderAbandonUseCase
  | DemanderConfirmationAbandonUseCase
  | RejeterAbandonUseCase;

export {
  AccorderAbandonUseCase,
  AnnulerAbandonUseCase,
  AnnulerRejetAbandonUseCase,
  ConfirmerAbandonUseCase,
  DemanderAbandonUseCase,
  DemanderConfirmationAbandonUseCase,
  RejeterAbandonUseCase,
};

// Register
export * from './abandon.register';

// ValueTypes
export * as StatutAbandon from './statutAbandon.valueType';
export * as Abandon from './abandon.valueType';
