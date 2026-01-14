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
  ConsulterDétailCandidatureQuery,
  ConsulterDétailCandidatureReadModel,
} from './détail/consulter/consulterDétailCandidature.query';
import { DétailCandidatureImportéEvent } from './détail/importer/détailCandidatureImporté.event';
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
  ListerFournisseursÀLaCandidatureQuery,
  ListerFournisseursÀLaCandidatureReadModel,
} from './lister/listerFournisseursÀLaCandidature.query';
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
  | ListerFournisseursÀLaCandidatureQuery
  | ConsulterCandidatureQuery
  | ConsulterDétailCandidatureQuery;

export {
  ListerProjetsEligiblesPreuveRecanditureQuery,
  ListerCandidaturesQuery,
  ListerFournisseursÀLaCandidatureQuery,
  ConsulterCandidatureQuery,
  ConsulterDétailCandidatureQuery,
};

// ReadModel
export {
  ListerProjetsEligiblesPreuveRecanditureReadModel,
  ListerCandidaturesReadModel,
  ListerFournisseursÀLaCandidatureReadModel,
  ConsulterCandidatureReadModel,
  ConsulterDétailCandidatureReadModel,
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
export * from './candidature.register';

// Entities
export * from './candidature.entity';
export * from './détail/détailCandidature.entity';

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
export * as DétailCandidature from './détail/détailCandidature.valueType';

// Type
export * from './détail/détailCandidature.valueType';

export { fournisseursCandidatureDétailKeys } from './lister/listerFournisseursÀLaCandidature.query';
