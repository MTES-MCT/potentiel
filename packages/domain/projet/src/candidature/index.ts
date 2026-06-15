import type {
  ConsulterCandidatureQuery,
  ConsulterCandidatureReadModel,
} from './consulter/consulterCandidature.query.js';
import type {
  CandidatureCorrigéeEvent,
  CandidatureCorrigéeEventV1,
} from './corriger/candidatureCorrigée.event.js';
import type { CorrigerCandidatureUseCase } from './corriger/corrigerCandidature.usecase.js';
import type {
  ConsulterDétailCandidatureQuery,
  ConsulterDétailCandidatureReadModel,
} from './détail/consulter/consulterDétailCandidature.query.js';
import type { DétailCandidatureImportéEvent } from './détail/importer/détailCandidatureImporté.event.js';
import type {
  CandidatureImportéeEvent,
  CandidatureImportéeEventV1,
  DétailsFournisseursCandidatureImportésEvent,
} from './importer/candidatureImportée.event.js';
import type { ImporterCandidatureUseCase } from './importer/importerCandidature.usecase.js';
import type {
  ListerCandidaturesQuery,
  ListerCandidaturesReadModel,
} from './lister/listerCandidatures.query.js';
import type {
  DétailsFournisseurListItemReadModel,
  ListerDétailsFournisseurQuery,
  ListerDétailsFournisseurReadModel,
} from './lister/listerDétailsFournisseur.query.js';
import type {
  ListerProjetsEligiblesPreuveRecanditureQuery,
  ListerProjetsEligiblesPreuveRecanditureReadModel,
} from './lister/listerProjetsEligiblesPreuveRecanditure.query.js';
import type {
  CandidatureNotifiéeEvent,
  CandidatureNotifiéeEventV1,
  CandidatureNotifiéeEventV2,
} from './notifier/candidatureNotifiée.event.js';
import type { NotifierCandidatureUseCase } from './notifier/notifierCandidature.usecase.js';

// Query
export type CandidatureQuery =
  | ListerCandidaturesQuery
  | ListerProjetsEligiblesPreuveRecanditureQuery
  | ListerDétailsFournisseurQuery
  | ConsulterCandidatureQuery
  | ConsulterDétailCandidatureQuery;

// ReadModel
// Port
export type {
  ConsulterCandidatureQuery,
  ConsulterCandidatureReadModel,
  ConsulterDétailCandidatureQuery,
  ConsulterDétailCandidatureReadModel,
  DétailsFournisseurListItemReadModel,
  ListerCandidaturesQuery,
  ListerCandidaturesReadModel,
  ListerDétailsFournisseurQuery,
  ListerDétailsFournisseurReadModel,
  ListerProjetsEligiblesPreuveRecanditureQuery,
  ListerProjetsEligiblesPreuveRecanditureReadModel,
};

// UseCases
export type CandidatureUseCase =
  | ImporterCandidatureUseCase
  | CorrigerCandidatureUseCase
  | NotifierCandidatureUseCase;

// Entities
export type * from './candidature.entity.js';
// Events
export type { CandidatureEvent } from './candidature.event.js';
// Register
export * from './candidature.register.js';
export * as Coordonnées from './coordonnées.valueType.js';
export * as DocumentCandidature from './documentCandidature.valueType.js';
export * as Dépôt from './dépôt.valueType.js';
export type * from './détail/détailCandidature.entity.js';
export type * as DétailCandidature from './détail/détailCandidature.valueType.js';
// Type
export type * from './détail/détailCandidature.valueType.js';
export type * from './détail/détailFournisseursCandidature.entity.js';
export * as HistoriqueAbandon from './historiqueAbandon.valueType.js';
export * as Instruction from './instruction.valueType.js';
export type * from './lister/listerDétailsFournisseur.query.js';
export * as Localité from './localité.valueType.js';
export * as RaccordementDépôt from './raccordementDépôt.valueType.js';
export * as StatutCandidature from './statutCandidature.valueType.js';
export * as TypeActionnariat from './typeActionnariat.valueType.js';
export * as TypeGarantiesFinancières from './typeGarantiesFinancières.valueType.js';
// ValueType
export * as TypeTechnologie from './typeTechnologie.valueType.js';
export * as TypologieInstallation from './typologieInstallation.valueType.js';
export * as UnitéPuissance from './unitéPuissance.valueType.js';
export type {
  CandidatureCorrigéeEvent,
  CandidatureCorrigéeEventV1,
  CandidatureImportéeEvent,
  CandidatureImportéeEventV1,
  CandidatureNotifiéeEvent,
  CandidatureNotifiéeEventV1,
  CandidatureNotifiéeEventV2,
  CorrigerCandidatureUseCase,
  DétailCandidatureImportéEvent,
  DétailsFournisseursCandidatureImportésEvent,
  ImporterCandidatureUseCase,
  NotifierCandidatureUseCase,
};
