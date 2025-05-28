import { AccorderAbandonUseCase } from './accorder/accorderAbandon.usecase';
import { ConfirmerAbandonUseCase } from './confirmer/confirmerAbandon.usecase';
import { DemanderAbandonUseCase } from './demander/demanderAbandon.usecase';
import { DemanderConfirmationAbandonUseCase } from './demanderConfirmation/demanderConfirmationAbandon.usecase';
import { DemanderPreuveRecandidatureAbandonUseCase } from './demanderPreuveRecandidature/demanderPreuveRecandidature.usecase';
import { TransmettrePreuveRecandidatureAbandonUseCase } from './transmettrePreuveRecandidature/transmettrePreuveRecandidatureAbandon.usecase';

// UseCases

export type AbandonUseCase =
  | DemanderAbandonUseCase
  | AccorderAbandonUseCase
  | DemanderPreuveRecandidatureAbandonUseCase
  | TransmettrePreuveRecandidatureAbandonUseCase
  | DemanderConfirmationAbandonUseCase
  | ConfirmerAbandonUseCase;

export {
  DemanderAbandonUseCase,
  AccorderAbandonUseCase,
  DemanderPreuveRecandidatureAbandonUseCase,
  TransmettrePreuveRecandidatureAbandonUseCase,
  DemanderConfirmationAbandonUseCase,
  ConfirmerAbandonUseCase,
};

// Events
export * from './accorder/accorderAbandon.event';
export * from './annuler/annulerAbandon.event';
export * from './demander/demanderAbandon.event';
export * from './rejeter/rejeterAbandon.event';
export * from './instruire/instruireAbandon.event';
export * from './demanderPreuveRecandidature/demanderPreuveRecandidature.event';
export * from './transmettrePreuveRecandidature/transmettrePreuveRecandidature.event';
export * from './demanderConfirmation/demanderConfirmation.event';
export * from './confirmer/confirmerAbandon.event';

export { AbandonEvent } from './abandon.event';

// ValueTypes
export * as StatutAbandon from './statutAbandon.valueType';
export * as TypeDocumentAbandon from './typeDocumentAbandon.valueType';
