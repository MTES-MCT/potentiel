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
import { ListerAbandonsQuery, ListerAbandonReadModel } from './lister/listerAbandon.query';
import { RejeterAbandonUseCase } from './rejeter/rejeterAbandon.usecase';
import { DemanderPreuveRecandidatureAbandonUseCase } from './demander/demanderPreuveRecandidatureAbandon.usecase';
import { TransmettrePreuveRecandidatureAbandonUseCase } from './transmettre/transmettrePreuveRecandidatureAbandon.usecase';

// Query
export type AbandonQuery = ConsulterAbandonQuery | ListerAbandonsQuery;

export { ConsulterAbandonQuery, ListerAbandonsQuery };

// ReadModel
export { ConsulterAbandonReadModel, ListerAbandonReadModel };

// UseCases
export type AbandonUseCase =
  | AccorderAbandonUseCase
  | AnnulerAbandonUseCase
  | AnnulerRejetAbandonUseCase
  | ConfirmerAbandonUseCase
  | DemanderAbandonUseCase
  | DemanderConfirmationAbandonUseCase
  | RejeterAbandonUseCase
  | TransmettrePreuveRecandidatureAbandonUseCase
  | DemanderPreuveRecandidatureAbandonUseCase;

export {
  AccorderAbandonUseCase,
  AnnulerAbandonUseCase,
  AnnulerRejetAbandonUseCase,
  ConfirmerAbandonUseCase,
  DemanderAbandonUseCase,
  DemanderConfirmationAbandonUseCase,
  RejeterAbandonUseCase,
};

// Event
export { AbandonEvent } from './abandon.aggregate';
export { PreuveRecandidatureDemandéeEvent } from './demander/demanderPreuveRecandidatureAbandon.behavior';
export { PreuveRecandidatureTransmiseEvent } from './transmettre/transmettrePreuveRecandidatureAbandon.behavior';

// Register
export { registerAbandonQueries, registerAbandonUseCases } from './abandon.register';

// ValueTypes
export * as StatutAbandon from './statutAbandon.valueType';
export * as Abandon from './abandon.valueType';
export * as TypeDocumentAbandon from './typeDocumentAbandon.valueType';

// Projections
export * from './abandon.projection';
