import {
  ConsulterCandidatureQuery,
  ConsulterCandidatureReadModel,
} from './consulter/consulterCandidature.query.js';
import {
  CandidatureCorrigéeEvent,
  CandidatureCorrigéeEventV1,
} from './corriger/candidatureCorrigée.event.js';
import { CorrigerCandidatureUseCase } from './corriger/corrigerCandidature.usecase.js';
import {
  ConsulterDétailCandidatureQuery,
  ConsulterDétailCandidatureReadModel,
} from './détail/consulter/consulterDétailCandidature.query.js';
import { DétailCandidatureImportéEvent } from './détail/importer/détailCandidatureImporté.event.js';
import {
  CandidatureImportéeEvent,
  CandidatureImportéeEventV1,
  DétailsFournisseursCandidatureImportésEvent,
} from './importer/candidatureImportée.event.js';
import { ImporterCandidatureUseCase } from './importer/importerCandidature.usecase.js';
import {
  ListerCandidaturesQuery,
  ListerCandidaturesReadModel,
} from './lister/listerCandidatures.query.js';
import {
  DétailsFournisseurListItemReadModel,
  ListerDétailsFournisseurQuery,
  ListerDétailsFournisseurReadModel,
} from './lister/listerDétailsFournisseur.query.js';
import {
  ListerProjetsEligiblesPreuveRecanditureQuery,
  ListerProjetsEligiblesPreuveRecanditureReadModel,
  RécupérerProjetsEligiblesPreuveRecanditurePort,
} from './lister/listerProjetsEligiblesPreuveRecanditure.query.js';
import {
  CandidatureNotifiéeEvent,
  CandidatureNotifiéeEventV1,
  CandidatureNotifiéeEventV2,
} from './notifier/candidatureNotifiée.event.js';
import { NotifierCandidatureUseCase } from './notifier/notifierCandidature.usecase.js';

// Query
export type CandidatureQuery =
  | ListerCandidaturesQuery
  | ListerProjetsEligiblesPreuveRecanditureQuery
  | ListerDétailsFournisseurQuery
  | ConsulterCandidatureQuery
  | ConsulterDétailCandidatureQuery;

export type {
  ListerProjetsEligiblesPreuveRecanditureQuery,
  ListerCandidaturesQuery,
  ListerDétailsFournisseurQuery,
  ConsulterCandidatureQuery,
  ConsulterDétailCandidatureQuery,
};

// ReadModel
export type {
  ListerProjetsEligiblesPreuveRecanditureReadModel,
  ListerCandidaturesReadModel,
  DétailsFournisseurListItemReadModel,
  ListerDétailsFournisseurReadModel,
  ConsulterCandidatureReadModel,
  ConsulterDétailCandidatureReadModel,
};

// Port
export type { RécupérerProjetsEligiblesPreuveRecanditurePort };

// UseCases
export type CandidatureUseCase =
  | ImporterCandidatureUseCase
  | CorrigerCandidatureUseCase
  | NotifierCandidatureUseCase;
export type { ImporterCandidatureUseCase, CorrigerCandidatureUseCase, NotifierCandidatureUseCase };

// Events
export type { CandidatureEvent } from './candidature.event.js';

export type {
  DétailCandidatureImportéEvent,
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
export * from './candidature.register.js';

// Entities
export type * from './candidature.entity.js';
export type * from './détail/détailCandidature.entity.js';

// ValueType
export * as TypeTechnologie from './typeTechnologie.valueType.js';
export * as TypeActionnariat from './typeActionnariat.valueType.js';
export * as HistoriqueAbandon from './historiqueAbandon.valueType.js';
export * as StatutCandidature from './statutCandidature.valueType.js';
export * as TypeGarantiesFinancières from './typeGarantiesFinancières.valueType.js';
export * as Localité from './localité.valueType.js';
export * as UnitéPuissance from './unitéPuissance.valueType.js';
export * as Dépôt from './dépôt.valueType.js';
export * as Instruction from './instruction.valueType.js';
export * as TypologieInstallation from './typologieInstallation.valueType.js';
export type * as DétailCandidature from './détail/détailCandidature.valueType.js';

// Type
export type * from './détail/détailCandidature.valueType.js';
export { type DétailFournisseur } from './lister/listerDétailsFournisseur.query.js';
