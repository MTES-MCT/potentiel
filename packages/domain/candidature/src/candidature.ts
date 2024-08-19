import {
  ConsulterProjetQuery,
  RécupérerProjetPort,
  ConsulterProjetReadModel,
} from './consulter/consulterProjet.query';
import {
  ListerProjetsEligiblesPreuveRecanditureQuery,
  RécupérerProjetsEligiblesPreuveRecanditurePort,
  ListerProjetsEligiblesPreuveRecanditureReadModel,
} from './lister/listerProjetsEligiblesPreuveRecanditure.query';
import {
  RécupérerProjetsPort,
  ListerProjetsQuery,
  ListerProjetsReadModel,
  ListerProjetsListItemReadModel,
} from './lister/listerProjets.query';
import { ImporterCandidatureUseCase } from './importer/importerCandidature.usecase';
import type { CandidatureImportéeEvent } from './importer/importerCandidature.behavior';
import {
  ConsulterCandidatureQuery,
  ConsulterCandidatureReadModel,
} from './consulter/consulterCandidature.query';
import { NotifierCandidatureUseCase } from './notifier/notifierCandidature.usecase';
import { CorrigerCandidatureUseCase } from './corriger/corrigerCandidature.usecase';
import type { CandidatureCorrigéeEvent } from './corriger/corrigerCandidature.behavior';
import {
  ListerCandidaturesQuery,
  ListerCandidaturesReadModel,
} from './lister/listerCandidatures.query';
import { LauréatNotifié, ÉliminéNotifié } from './notifier/notifierCandidature.behavior';

// Query
export type CandidatureQuery =
  | ConsulterProjetQuery
  | ListerCandidaturesQuery
  | ListerProjetsEligiblesPreuveRecanditureQuery
  | ListerProjetsQuery;

export {
  ConsulterProjetQuery,
  ListerProjetsEligiblesPreuveRecanditureQuery,
  ConsulterProjetReadModel,
  ListerProjetsEligiblesPreuveRecanditureReadModel,
  ListerProjetsQuery,
  ListerProjetsListItemReadModel,
  ListerProjetsReadModel,
  ListerCandidaturesQuery,
  ListerCandidaturesReadModel,
  ConsulterCandidatureQuery,
  ConsulterCandidatureReadModel,
};

// UseCases
export type CandidatureUseCase =
  | ImporterCandidatureUseCase
  | CorrigerCandidatureUseCase
  | NotifierCandidatureUseCase;
export { ImporterCandidatureUseCase, CorrigerCandidatureUseCase, NotifierCandidatureUseCase };

// Events
export type CandidatureEvent =
  | CandidatureImportéeEvent
  | CandidatureCorrigéeEvent
  | LauréatNotifié
  | ÉliminéNotifié;

export { CandidatureImportéeEvent, CandidatureCorrigéeEvent };

// Register
export * from './register';

// Port
export {
  RécupérerProjetPort,
  RécupérerProjetsEligiblesPreuveRecanditurePort,
  RécupérerProjetsPort,
};

// Entity
export * from './projet.entity';
export * from './candidature.entity';

// Value Types
export * as Technologie from './technologie.valueType';
export * as HistoriqueAbandon from './historiqueAbandon.valueType';
