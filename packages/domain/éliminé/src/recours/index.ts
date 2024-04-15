import { AccorderRecoursUseCase } from './accorder/accorderRecours.usecase';
import { AnnulerRecoursUseCase } from './annuler/annulerRecours.usecase';
import {
  ConsulterRecoursQuery,
  ConsulterRecoursReadModel,
} from './consulter/consulterRecours.query';
import { DemanderRecoursUseCase } from './demander/demanderRecours.usecase';
import {
  ListerRecoursQuery,
  ListerRecoursReadModel,
  ListerRecoursPourPorteurPort,
  ListerRecoursPort,
  RécupérerRégionDrealPort,
} from './lister/listerRecours.query';
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
  | RejeterRecoursUseCase;

export {
  AccorderRecoursUseCase,
  AnnulerRecoursUseCase,
  DemanderRecoursUseCase,
  RejeterRecoursUseCase,
};

// Event
export { RecoursEvent } from './recours.aggregate';
export { RecoursAnnuléEvent } from './annuler/annulerRecours.behavior';
export { RecoursRejetéEvent } from './rejeter/rejeterRecours.behavior';

// Register
export { registerRecoursQueries, registerRecoursUseCases } from './recours.register';

// ValueTypes
export * as StatutRecours from './statutRecours.valueType';
export * as Recours from './recours.valueType';
export * as TypeDocumentRecours from './typeDocumentRecours.valueType';

// Entities
export * from './recours.entity';

// Ports
export { ListerRecoursPourPorteurPort, ListerRecoursPort, RécupérerRégionDrealPort };
