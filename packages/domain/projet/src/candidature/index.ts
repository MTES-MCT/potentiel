import {
  ConsulterCandidatureQuery,
  ConsulterCandidatureReadModel,
} from './consulter/consulterCandidature.query';
import {
  CandidatureCorrigéeEvent,
  CandidatureCorrigéeEventV1,
} from './corriger/candidatureCorrigée.event';
import { CorrigerCandidatureUseCase } from './corriger/corrigerCandidature.usecase';
import {
  CandidatureImportéeEvent,
  CandidatureImportéeEventV1,
  DétailsFournisseursCandidatureImportésEvent,
} from './importer/candidatureImportée.event';
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
  CandidatureNotifiéeEventV2,
} from './notifier/candidatureNotifiée.event';
import { NotifierCandidatureUseCase } from './notifier/notifierCandidature.usecase';

// Query
export type CandidatureQuery =
  | ListerCandidaturesQuery
  | ListerProjetsEligiblesPreuveRecanditureQuery
  | ConsulterCandidatureQuery;

export {
  ListerProjetsEligiblesPreuveRecanditureQuery,
  ListerCandidaturesQuery,
  ConsulterCandidatureQuery,
};

// ReadModel
export {
  ListerProjetsEligiblesPreuveRecanditureReadModel,
  ListerCandidaturesReadModel,
  ConsulterCandidatureReadModel,
};

// Port
export { RécupérerProjetsEligiblesPreuveRecanditurePort };

// UseCases
export type CandidatureUseCase =
  | ImporterCandidatureUseCase
  | CorrigerCandidatureUseCase
  | NotifierCandidatureUseCase;
export { ImporterCandidatureUseCase, CorrigerCandidatureUseCase, NotifierCandidatureUseCase };

// Events
export { CandidatureEvent } from './candidature.event';

export {
  CandidatureImportéeEventV1,
  CandidatureImportéeEvent,
  CandidatureCorrigéeEvent,
  CandidatureCorrigéeEventV1,
  CandidatureNotifiéeEvent,
  CandidatureNotifiéeEventV1,
  CandidatureNotifiéeEventV2,
  DétailsFournisseursCandidatureImportésEvent,
};

// Register
export * from './candidature.register';

// Entities
export * from './candidature.entity';

// ValueType
export * as TypeTechnologie from './typeTechnologie.valueType';
export * as TypeActionnariat from './typeActionnariat.valueType';
export * as HistoriqueAbandon from './historiqueAbandon.valueType';
export * as StatutCandidature from './statutCandidature.valueType';
export * as TypeGarantiesFinancières from './typeGarantiesFinancières.valueType';
export * as Localité from './localité.valueType';
export * as UnitéPuissance from './unitéPuissance.valueType';
export * as Dépôt from './dépôt.valueType';
export * as Instruction from './instruction.valueType';
export * as TypologieInstallation from './typologieInstallation.valueType';
