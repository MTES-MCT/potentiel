import { AccorderChangementActionnaireCommand } from './changement/accorder/accorderChangementActionnairet.command';
import { AccorderChangementActionnaireUseCase } from './changement/accorder/accorderChangementActionnaire.usecase';
import { AnnulerChangementActionnaireCommand } from './changement/annuler/annulerChangementActionnaire.command';
import { AnnulerChangementActionnaireUseCase } from './changement/annuler/annulerChangementActionnaire.usecase';
import {
  ConsulterChangementActionnaireQuery,
  ConsulterChangementActionnaireReadModel,
} from './changement/consulter/consulterChangementActionnaire.query';
import { DemanderChangementUseCase } from './changement/demander/demanderChangementActionnaire.usecase';
import {
  ListerChangementActionnaireQuery,
  ListerChangementActionnaireReadModel,
} from './changement/lister/listerChangementActionnaire.query';
import { RejeterChangementActionnaireCommand } from './changement/rejeter/rejeterChangementActionnaire.command';
import { RejeterChangementActionnaireUseCase } from './changement/rejeter/rejeterChangementActionnaire.usecase';
import {
  ConsulterActionnaireQuery,
  ConsulterActionnaireReadModel,
} from './consulter/consulterActionnaire.query';
import { ImporterActionnaireCommand } from './importer/importerActionnaire.command';
import { ModifierActionnaireCommand } from './modifier/modifierActionnaire.command';
import { ModifierActionnaireUseCase } from './modifier/modifierActionnaire.usecase';
import { SupprimerChangementActionnaireCommand } from './changement/supprimer/supprimerChangementActionnaire.command';

// Query
export type ActionnaireQuery =
  | ConsulterActionnaireQuery
  | ConsulterChangementActionnaireQuery
  | ListerChangementActionnaireQuery;
export type {
  ConsulterActionnaireQuery,
  ConsulterChangementActionnaireQuery,
  ListerChangementActionnaireQuery,
};

// ReadModel
export type {
  ConsulterActionnaireReadModel,
  ConsulterChangementActionnaireReadModel,
  ListerChangementActionnaireReadModel,
};

// UseCase
export type ActionnaireUseCase =
  | ModifierActionnaireUseCase
  | DemanderChangementUseCase
  | AnnulerChangementActionnaireUseCase
  | AccorderChangementActionnaireUseCase
  | RejeterChangementActionnaireUseCase;
export type {
  ModifierActionnaireUseCase,
  DemanderChangementUseCase,
  AnnulerChangementActionnaireUseCase,
  AccorderChangementActionnaireUseCase,
  RejeterChangementActionnaireUseCase,
};

// Command
export type ActionnaireCommand =
  | ImporterActionnaireCommand
  | ModifierActionnaireCommand
  | AnnulerChangementActionnaireCommand
  | AccorderChangementActionnaireCommand
  | RejeterChangementActionnaireCommand
  | SupprimerChangementActionnaireCommand;
export type {
  ImporterActionnaireCommand,
  ModifierActionnaireCommand,
  AnnulerChangementActionnaireCommand,
  AccorderChangementActionnaireCommand,
  RejeterChangementActionnaireCommand,
  SupprimerChangementActionnaireCommand,
};

// Event
export type { ActionnaireEvent } from './actionnaire.aggregate';
export type { ActionnaireImportéEvent } from './importer/importerActionnaire.behavior';
export type { ActionnaireModifiéEvent } from './modifier/modifierActionnaire.behavior';
export type { ChangementActionnaireDemandéEvent } from './changement/demander/demanderChangementActionnaire.behavior';
export type { ChangementActionnaireAnnuléEvent } from './changement/annuler/annulerChangementActionnaire.behavior';
export type { ChangementActionnaireAccordéEvent } from './changement/accorder/accorderChangementActionnaire.behavior';
export type { ChangementActionnaireRejetéEvent } from './changement/rejeter/rejeterChangementActionnaire.behavior';
export type { ChangementActionnaireSuppriméEvent } from './changement/supprimer/supprimerChangementActionnaire.behavior';

// Saga
export * as ActionnaireSaga from './saga';

// ValueType
export * as StatutChangementActionnaire from './statutChangementActionnaire.valueType';
export * as TypeDocumentActionnaire from './typeDocumentActionnaire.valueType';

// Entities
export * from './actionnaire.entity';
export * from './changementActionnaire.entity';
