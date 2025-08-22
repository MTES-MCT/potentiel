import { AccorderRecoursUseCase } from './accorder/accorderRecours.usecase';
import { AnnulerRecoursUseCase } from './annuler/annulerRecours.usecase';
import {
  ConsulterRecoursQuery,
  ConsulterRecoursReadModel,
} from './consulter/consulterRecours.query';
import { DemanderRecoursUseCase } from './demander/demanderRecours.usecase';
import { PasserEnInstructionRecoursUseCase } from './instruire/passerRecoursEnInstruction.usecase';
import { ListerRecoursQuery, ListerRecoursReadModel } from './lister/listerRecours.query';
import {
  HistoriqueRecoursProjetListItemReadModel,
  ListerHistoriqueRecoursProjetQuery,
  ListerHistoriqueRecoursProjetReadModel,
} from './listerHistorique/listerHistoriqueRecoursProjet.query';
import { RejeterRecoursUseCase } from './rejeter/rejeterRecours.usecase';

// Query
export type RecoursQuery =
  | ConsulterRecoursQuery
  | ListerRecoursQuery
  | ListerHistoriqueRecoursProjetQuery;

export { ConsulterRecoursQuery, ListerRecoursQuery, ListerHistoriqueRecoursProjetQuery };

// ReadModel
export {
  ConsulterRecoursReadModel,
  ListerRecoursReadModel,
  HistoriqueRecoursProjetListItemReadModel,
  ListerHistoriqueRecoursProjetReadModel,
};

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

export { RecoursAccordéEvent } from './accorder/recoursAccordé.event';
export { RecoursAnnuléEvent } from './annuler/annulerRecours.event';
export { RecoursDemandéEvent } from './demander/demanderRecours.event';
export { RecoursPasséEnInstructionEvent } from './instruire/passerRecoursEnInstruction.event';
// Entities
export * from './recours.entity';
// Event
export { RecoursEvent } from './recours.event';
// Register
export { registerRecoursQueries, registerRecoursUseCases } from './recours.register';
export { RecoursRejetéEvent } from './rejeter/rejeterRecours.event';
// ValueTypes
export * as StatutRecours from './statutRecours.valueType';
export * as TypeDocumentRecours from './typeDocumentRecours.valueType';
