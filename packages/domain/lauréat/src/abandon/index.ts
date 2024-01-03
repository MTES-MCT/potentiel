import { AccorderAbandonUseCase } from './accorder/accorderAbandon.usecase';
import { AnnulerAbandonUseCase } from './annuler/annulerAbandon.usecase';
import { AnnulerRejetAbandonUseCase } from './annulerRejet/annulerRejetAbandon.usecase';
import { ConfirmerAbandonUseCase } from './confirmer/confirmerAbandon.usecase';
import {
  ConsulterAbandonQuery,
  ConsulterAbandonReadModel,
} from './consulter/consulterAbandon.query';
import { DemanderAbandonUseCase } from './demander/demanderAbandon.usecase';
import { DemanderConfirmationAbandonUseCase } from './demanderConfirmation/demanderConfirmationAbandon.usecase';
import {
  ListerAbandonsQuery,
  ListerAbandonReadModel,
  ListerAbandonsParProjetsPort,
  ListerAbandonsPort,
} from './lister/listerAbandon.query';
import { RejeterAbandonUseCase } from './rejeter/rejeterAbandon.usecase';
import { DemanderPreuveRecandidatureAbandonUseCase } from './demanderPreuveRecandidature/demanderPreuveRecandidatureAbandon.usecase';
import { TransmettrePreuveRecandidatureAbandonUseCase } from './transmettre/transmettrePreuveRecandidatureAbandon.usecase';
import { ListerAbandonsAvecRecandidatureÀRelancerQuery } from './lister/listerAbandonAvecRecandidatureÀRelancer.query';
import { DétecterAbandonQuery } from './détecter/détecterAbandon.query';
import {
  BuildModèleRéponseAbandonPort,
  GénérerModèleRéponseAbandonQuery,
  GénérerModèleRéponseAbandonReadModel,
} from './générerModèleRéponse/générerModèleRéponseAbandon.query';

// Query
export type AbandonQuery =
  | DétecterAbandonQuery
  | ConsulterAbandonQuery
  | ListerAbandonsQuery
  | ListerAbandonsAvecRecandidatureÀRelancerQuery
  | GénérerModèleRéponseAbandonQuery;

export {
  DétecterAbandonQuery,
  ConsulterAbandonQuery,
  ListerAbandonsQuery,
  ListerAbandonsAvecRecandidatureÀRelancerQuery,
  GénérerModèleRéponseAbandonQuery,
};

// ReadModel
export { ConsulterAbandonReadModel, ListerAbandonReadModel, GénérerModèleRéponseAbandonReadModel };

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
export { AbandonAnnuléEvent } from './annuler/annulerAbandon.behavior';
export { ConfirmationAbandonDemandéeEvent } from './demanderConfirmation/demanderConfirmationAbandon.behavior';
export { AbandonConfirméEvent } from './confirmer/confirmerAbandon.behavior';
export { AbandonRejetéEvent } from './rejeter/rejeterAbandon.behavior';
export { PreuveRecandidatureDemandéeEvent } from './demanderPreuveRecandidature/demanderPreuveRecandidatureAbandon.behavior';
export { PreuveRecandidatureTransmiseEvent } from './transmettre/transmettrePreuveRecandidatureAbandon.behavior';

// Register
export { registerAbandonQueries, registerAbandonUseCases } from './abandon.register';

// ValueTypes
export * as StatutAbandon from './statutAbandon.valueType';
export * as Abandon from './abandon.valueType';
export * as TypeDocumentAbandon from './typeDocumentAbandon.valueType';

// Projections
export * from './abandon.projection';

// Ports
export { ListerAbandonsParProjetsPort, BuildModèleRéponseAbandonPort, ListerAbandonsPort };
