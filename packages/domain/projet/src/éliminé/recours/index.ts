import { AccorderRecoursUseCase } from './accorder/accorderRecours.usecase';
import { AnnulerRecoursUseCase } from './annuler/annulerRecours.usecase';
import {
  ConsulterDemandeRecoursQuery,
  ConsulterDemandeRecoursReadModel,
} from './consulter/consulterDemandeRecours.query';
import { DemanderRecoursUseCase } from './demander/demanderRecours.usecase';
import { PasserEnInstructionRecoursUseCase } from './instruire/passerRecoursEnInstruction.usecase';
import {
  ListerDemandeRecoursQuery,
  ListerDemandeRecoursReadModel,
} from './lister/listerDemandeRecours.query';
import {
  ListerHistoriqueRecoursProjetQuery,
  HistoriqueRecoursProjetListItemReadModel,
  ListerHistoriqueRecoursProjetReadModel,
} from './listerHistorique/listerHistoriqueRecoursProjet.query';
import { RejeterRecoursUseCase } from './rejeter/rejeterRecours.usecase';

// Query
export type RecoursQuery =
  | ConsulterDemandeRecoursQuery
  | ListerDemandeRecoursQuery
  | ListerHistoriqueRecoursProjetQuery;

export {
  ConsulterDemandeRecoursQuery,
  ListerDemandeRecoursQuery,
  ListerHistoriqueRecoursProjetQuery,
};

// ReadModel
export {
  ConsulterDemandeRecoursReadModel,
  ListerDemandeRecoursReadModel,
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
export * from './demandeRecours.entity';
export * from './recours.entity';
