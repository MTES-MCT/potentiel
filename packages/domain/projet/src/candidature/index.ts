import {
  ConsulterCandidatureQuery,
  ConsulterCandidatureReadModel,
} from './consulter/consulterCandidature.query';
import {
  ConsulterProjetQuery,
  ConsulterProjetReadModel,
  RécupérerProjetPort,
} from './consulter/consulterProjet.query';
import { CandidatureCorrigéeEvent } from './corriger/candidatureCorrigée.event';
import { CorrigerCandidatureUseCase } from './corriger/corrigerCandidature.usecase';
import { CandidatureImportéeEvent } from './importer/candidatureImportée.event';
import { ImporterCandidatureUseCase } from './importer/importerCandidature.usecase';
import {
  ListerCandidaturesQuery,
  ListerCandidaturesReadModel,
} from './lister/listerCandidatures.query';
import {
  ListerProjetsEligiblesPreuveRecanditureQuery,
  ListerProjetsEligiblesPreuveRecanditureReadModel,
  RécupérerProjetsEligiblesPreuveRecanditurePort,
} from './lister/listerProjetsEligiblesPreuveRecanditure.query';
import {
  CandidatureNotifiéeEvent,
  CandidatureNotifiéeEventV1,
} from './notifier/candidatureNotifiée.event';
import { NotifierCandidatureUseCase } from './notifier/notifierCandidature.usecase';

// Query
export type CandidatureQuery =
  | ConsulterProjetQuery
  | ListerCandidaturesQuery
  | ListerProjetsEligiblesPreuveRecanditureQuery
  | ConsulterCandidatureQuery;

export {
  ConsulterProjetQuery,
  ListerProjetsEligiblesPreuveRecanditureQuery,
  ListerCandidaturesQuery,
  ConsulterCandidatureQuery,
};

// ReadModel
export {
  ConsulterProjetReadModel,
  ListerProjetsEligiblesPreuveRecanditureReadModel,
  ListerCandidaturesReadModel,
  ConsulterCandidatureReadModel,
};

// Port
export { RécupérerProjetPort, RécupérerProjetsEligiblesPreuveRecanditurePort };

// UseCases
export type CandidatureUseCase =
  | ImporterCandidatureUseCase
  | CorrigerCandidatureUseCase
  | NotifierCandidatureUseCase;
export { ImporterCandidatureUseCase, CorrigerCandidatureUseCase, NotifierCandidatureUseCase };

// Events
export { CandidatureEvent } from './candidature.event';

export {
  CandidatureImportéeEvent,
  CandidatureCorrigéeEvent,
  CandidatureNotifiéeEvent,
  CandidatureNotifiéeEventV1,
};

// Register
export * from './candidature.register';

// Entities
export * from './candidature.entity';
export * from './projet.entity';

// ValueType
export * as TypeTechnologie from './typeTechnologie.valueType';
export * as TypeActionnariat from './typeActionnariat.valueType';
export * as HistoriqueAbandon from './historiqueAbandon.valueType';
export * as StatutCandidature from './statutCandidature.valueType';
export * as TypeGarantiesFinancières from './typeGarantiesFinancières.valueType';
export * as Localité from './localité.valueType';
