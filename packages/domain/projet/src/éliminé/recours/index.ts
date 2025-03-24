import { AccorderRecoursUseCase } from './accorder/accorderRecours.usecase';
import { AnnulerRecoursUseCase } from './annuler/annulerRecours.usecase';
import {
  ConsulterRecoursQuery,
  ConsulterRecoursReadModel,
} from './consulter/consulterRecours.query';
import { DemanderRecoursUseCase } from './demander/demanderRecours.usecase';
import { PasserEnInstructionRecoursUseCase } from './instruire/passerRecoursEnInstruction.usecase';
import { ListerRecoursQuery, ListerRecoursReadModel } from './lister/listerRecours.query';
import { RejeterRecoursUseCase } from './rejeter/rejeterRecours.usecase';

// Query
export type RecoursQuery = ConsulterRecoursQuery | ListerRecoursQuery;

export { ConsulterRecoursQuery, ListerRecoursQuery };

// ReadModel
export { ConsulterRecoursReadModel, ListerRecoursReadModel };

// UseCases
export type RecoursUseCase =
  | AccorderRecoursUseCase
  | AnnulerRecoursUseCase
  | DemanderRecoursUseCase
  | RejeterRecoursUseCase
  | PasserEnInstructionRecoursUseCase;

export {
  AccorderRecoursUseCase,
  AnnulerRecoursUseCase,
  DemanderRecoursUseCase,
  RejeterRecoursUseCase,
  PasserEnInstructionRecoursUseCase,
};

// Event
export { RecoursEvent } from './recours.event';
export { RecoursAnnuléEvent } from './annuler/annulerRecours.event';
export { RecoursRejetéEvent } from './rejeter/rejeterRecours.event';
export { RecoursAccordéEvent } from './accorder/recoursAccordé.event';
export { RecoursDemandéEvent } from './demander/demanderRecours.event';
export { RecoursPasséEnInstructionEvent } from './instruire/passerRecoursEnInstruction.event';

// Register
export { registerRecoursQueries, registerRecoursUseCases } from './recours.register';

// ValueTypes
export * as StatutRecours from './statutRecours.valueType';
export * as TypeDocumentRecours from './typeDocumentRecours.valueType';

// Entities
export * from './recours.entity';
