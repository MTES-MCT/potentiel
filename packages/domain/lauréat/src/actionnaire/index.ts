import { AccorderDemandeChangementActionnaireCommand } from './changement/accorder/accorderDemandeChangement.command';
import { AccorderDemandeChangementActionnaireUseCase } from './changement/accorder/accorderDemandeChangement.usecase';
import { AnnulerDemandeChangementActionnaireCommand } from './changement/annuler/annulerDemandeChangement.command';
import { AnnulerDemandeChangementActionnaireUseCase } from './changement/annuler/annulerDemandeChangement.usecase';
import {
  ConsulterChangementActionnaireQuery,
  ConsulterChangementActionnaireReadModel,
} from './changement/consulter/consulterChangementActionnaire.query';
import { DemanderChangementUseCase } from './changement/demander/demandeChangement.usecase';
import {
  ListerChangementActionnaireQuery,
  ListerChangementActionnaireReadModel,
} from './changement/lister/listerChangementActionnaire.query';
import { RejeterDemandeChangementActionnaireCommand } from './changement/rejeter/rejeterDemandeChangement.command';
import { RejeterDemandeChangementActionnaireUseCase } from './changement/rejeter/rejeterDemandeChangement.usecase';
import {
  ConsulterActionnaireQuery,
  ConsulterActionnaireReadModel,
} from './consulter/consulterActionnaire.query';
import { ImporterActionnaireCommand } from './importer/importerActionnaire.command';
import { ModifierActionnaireCommand } from './modifier/modifierActionnaire.command';
import { ModifierActionnaireUseCase } from './modifier/modifierActionnaire.usecase';

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
  | AnnulerDemandeChangementActionnaireUseCase
  | AccorderDemandeChangementActionnaireUseCase
  | RejeterDemandeChangementActionnaireUseCase;
export type {
  ModifierActionnaireUseCase,
  DemanderChangementUseCase,
  AnnulerDemandeChangementActionnaireUseCase,
  AccorderDemandeChangementActionnaireUseCase,
  RejeterDemandeChangementActionnaireUseCase,
};

// Command
export type ActionnaireCommand =
  | ImporterActionnaireCommand
  | ModifierActionnaireCommand
  | AnnulerDemandeChangementActionnaireCommand
  | AccorderDemandeChangementActionnaireCommand
  | RejeterDemandeChangementActionnaireCommand;
export type {
  ImporterActionnaireCommand,
  ModifierActionnaireCommand,
  AnnulerDemandeChangementActionnaireCommand,
  AccorderDemandeChangementActionnaireCommand,
  RejeterDemandeChangementActionnaireCommand,
};

// Event
export type { ActionnaireEvent } from './actionnaire.aggregate';
export type { ActionnaireImportéEvent } from './importer/importerActionnaire.behavior';
export type { ActionnaireModifiéEvent } from './modifier/modifierActionnaire.behavior';
export type { ChangementActionnaireDemandéEvent } from './changement/demander/demandeChangement.behavior';
export type { DemandeChangementActionnaireAnnuléEvent } from './changement/annuler/annulerDemandeChangement.behavior';
export type { DemandeChangementActionnaireAccordéeEvent } from './changement/accorder/accorderDemandeChangement.behavior';
export type { DemandeChangementActionnaireRejetéeEvent } from './changement/rejeter/rejeterDemandeChangement.behavior';

// Saga
export * as ActionnaireSaga from './actionnaire.saga';

// ValueType
export * as StatutChangementActionnaire from './statutChangementActionnaire.valueType';
export * as TypeDocumentActionnaire from './typeDocumentActionnaire.valueType';

// Entities
export * from './actionnaire.entity';
