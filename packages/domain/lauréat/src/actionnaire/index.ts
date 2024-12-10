import { AccorderDemandeChangementActionnaireCommand } from './changement/accorder/accorderChangementActionnairet.command';
import { AccorderDemandeChangementActionnaireUseCase } from './changement/accorder/accorderChangementActionnaire.usecase';
import { AnnulerDemandeChangementActionnaireCommand } from './changement/annuler/annulerChangementActionnaire.command';
import { AnnulerDemandeChangementActionnaireUseCase } from './changement/annuler/annulerChangementActionnaire.usecase';
import {
  ConsulterDemandeChangementActionnaireQuery,
  ConsulterDemandeChangementActionnaireReadModel,
} from './changement/consulter/consulterDemandeChangementActionnaire.query';
import { DemanderChangementUseCase } from './changement/demander/demandeChangementActionnaire.usecase';
import {
  ListerChangementActionnaireQuery,
  ListerChangementActionnaireReadModel,
} from './changement/lister/listerChangementActionnaire.query';
import { RejeterDemandeChangementActionnaireCommand } from './changement/rejeter/rejeterChangementActionnaire.command';
import { RejeterDemandeChangementActionnaireUseCase } from './changement/rejeter/rejeterChangementActionnaire.usecase';
import {
  ConsulterActionnaireQuery,
  ConsulterActionnaireReadModel,
} from './consulter/consulterActionnaire.query';
import { ImporterActionnaireCommand } from './importer/importerActionnaire.command';
import { ModifierActionnaireCommand } from './modifier/modifierActionnaire.command';
import { ModifierActionnaireUseCase } from './modifier/modifierActionnaire.usecase';
import { TransmettreActionnaireUseCase } from './transmettre/transmettreActionnaire.usecase';
import { TransmettreActionnaireCommand } from './transmettre/transmettreActionnaire.command';

// Query
export type ActionnaireQuery =
  | ConsulterActionnaireQuery
  | ConsulterDemandeChangementActionnaireQuery
  | ListerChangementActionnaireQuery;
export type {
  ConsulterActionnaireQuery,
  ConsulterDemandeChangementActionnaireQuery,
  ListerChangementActionnaireQuery,
};

// ReadModel
export type {
  ConsulterActionnaireReadModel,
  ConsulterDemandeChangementActionnaireReadModel,
  ListerChangementActionnaireReadModel,
};

// UseCase
export type ActionnaireUseCase =
  | TransmettreActionnaireUseCase
  | ModifierActionnaireUseCase
  | DemanderChangementUseCase
  | AnnulerDemandeChangementActionnaireUseCase
  | AccorderDemandeChangementActionnaireUseCase
  | RejeterDemandeChangementActionnaireUseCase;
export type {
  TransmettreActionnaireUseCase,
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
  | TransmettreActionnaireCommand
  | AnnulerDemandeChangementActionnaireCommand
  | AccorderDemandeChangementActionnaireCommand
  | RejeterDemandeChangementActionnaireCommand;
export type {
  ImporterActionnaireCommand,
  ModifierActionnaireCommand,
  TransmettreActionnaireCommand,
  AnnulerDemandeChangementActionnaireCommand,
  AccorderDemandeChangementActionnaireCommand,
  RejeterDemandeChangementActionnaireCommand,
};

// Event
export type { ActionnaireEvent } from './actionnaire.aggregate';
export type { ActionnaireImportéEvent } from './importer/importerActionnaire.behavior';
export type { ActionnaireModifiéEvent } from './modifier/modifierActionnaire.behavior';
export type { ActionnaireTransmisEvent } from './transmettre/transmettreActionnaire.behavior';
export type { ChangementActionnaireDemandéEvent } from './changement/demander/demandeChangementActionnaire.behavior';
export type { DemandeChangementActionnaireAnnuléEvent } from './changement/annuler/annulerChangementActionnaire.behavior';
export type { DemandeChangementActionnaireAccordéeEvent } from './changement/accorder/accorderChangementActionnaire.behavior';
export type { DemandeChangementActionnaireRejetéeEvent } from './changement/rejeter/rejeterChangementActionnaire.behavior';

// Saga
export * as ActionnaireSaga from './actionnaire.saga';

// ValueType
export * as StatutChangementActionnaire from './statutChangementActionnaire.valueType';
export * as TypeDocumentActionnaire from './typeDocumentActionnaire.valueType';

// Entities
export * from './actionnaire.entity';
