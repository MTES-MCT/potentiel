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
import { CorrigerCandidatureUseCase } from './corriger/corrigerCandidature.usecase';
import type { CandidatureCorrigéeEvent } from './corriger/corrigerCandidature.behavior';
import {
  ListerCandidaturesQuery,
  ListerCandidaturesReadModel,
} from './lister/listerCandidatures.query';
import { NotifierCandidatureUseCase } from './notifier/notifierCandidature.usecase';
import {
  CandidatureNotifiéeEvent,
  CandidatureNotifiéeEventV1,
} from './notifier/notifierCandidature.behavior';
import {
  ConsulterRésuméCandidatureQuery,
  ConsulterRésuméCandidatureReadModel,
} from './consulter/consulterRésuméCandidature.query';

// Query
export type CandidatureQuery =
  | ConsulterProjetQuery
  | ListerCandidaturesQuery
  | ListerProjetsEligiblesPreuveRecanditureQuery
  | ListerProjetsQuery
  | ConsulterCandidatureQuery
  | ConsulterRésuméCandidatureQuery;

export {
  ConsulterProjetQuery,
  ListerProjetsEligiblesPreuveRecanditureQuery,
  ListerProjetsQuery,
  ListerCandidaturesQuery,
  ConsulterCandidatureQuery,
  ConsulterRésuméCandidatureQuery,
};

// ReadModel
export {
  ConsulterProjetReadModel,
  ListerProjetsEligiblesPreuveRecanditureReadModel,
  ListerProjetsListItemReadModel,
  ListerProjetsReadModel,
  ListerCandidaturesReadModel,
  ConsulterCandidatureReadModel,
  ConsulterRésuméCandidatureReadModel,
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
  | CandidatureNotifiéeEvent
  | CandidatureNotifiéeEventV1;

export {
  CandidatureImportéeEvent,
  CandidatureCorrigéeEvent,
  CandidatureNotifiéeEvent,
  CandidatureNotifiéeEventV1,
};

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
export * as TypeTechnologie from './typeTechnologie.valueType';
export * as TypeActionnariat from './typeActionnariat.valueType';
export * as HistoriqueAbandon from './historiqueAbandon.valueType';
export * as StatutCandidature from './statutCandidature.valueType';
export * as TypeGarantiesFinancières from './typeGarantiesFinancières.valueType';

// Aggregate
export * as Aggregate from './candidature.aggregate';
