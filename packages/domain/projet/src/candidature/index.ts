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
  DétailsFournisseursCandidatureImportésEvent,
};

// Entities
export * from './candidature.entity';
// Register
export * from './candidature.register';
export * as Dépôt from './dépôt.valueType';
export * as HistoriqueAbandon from './historiqueAbandon.valueType';
export * as Instruction from './instruction.valueType';
export * as Localité from './localité.valueType';
export * from './projet.entity';
export * as StatutCandidature from './statutCandidature.valueType';
export * as TypeActionnariat from './typeActionnariat.valueType';
export * as TypeGarantiesFinancières from './typeGarantiesFinancières.valueType';
export * as TypeInstallationsAgrivoltaiques from './typeInstallationsAgrivoltaiques.valueType';
// ValueType
export * as TypeTechnologie from './typeTechnologie.valueType';
export * as TypologieBâtiment from './typologieBâtiment.valueType';
export * as UnitéPuissance from './unitéPuissance.valueType';
export * as VolumeRéservé from './volumeRéservé.valueType';
