import { AnnulerDemandeChangementActionnaireCommand } from './annulerDemandeChangement/annulerDemandeChangement.command';
import { AnnulerDemandeChangementActionnaireUseCase } from './annulerDemandeChangement/annulerDemandeChangement.usecase';
import { AccorderDemandeChangementActionnaireCommand } from './accorderDemandeChangement/accorderDemandeChangement.command';
import {
  ConsulterActionnaireQuery,
  ConsulterActionnaireReadModel,
} from './consulter/consulterActionnaire.query';
import {
  ConsulterChangementActionnaireQuery,
  ConsulterChangementActionnaireReadModel,
} from './consulterDemandeChangement/consulterChangementActionnaire.query';
import { DemanderChangementUseCase } from './demanderChangement/demandeChangementActionnaire.usecase';
import { ImporterActionnaireCommand } from './importer/importerActionnaire.command';
import { ModifierActionnaireCommand } from './modifier/modifierActionnaire.command';
import { ModifierActionnaireUseCase } from './modifier/modifierActionnaire.usecase';
import { AccorderDemandeChangementActionnaireUseCase } from './accorderDemandeChangement/accorderDemandeChangement.usecase';
import { RejeterDemandeChangementActionnaireCommand } from './rejeterDemandeChangement/rejeterDemandeChangement.command';
import { RejeterDemandeChangementActionnaireUseCase } from './rejeterDemandeChangement/rejeterDemandeChangement.usecase';
import { TransmettreActionnaireUseCase } from './transmettre/transmettreActionnaire.usecase';
import { TransmettreActionnaireCommand } from './transmettre/transmettreActionnaire.command';

// Query
export type ActionnaireQuery = ConsulterActionnaireQuery | ConsulterChangementActionnaireQuery;
export type { ConsulterActionnaireQuery, ConsulterChangementActionnaireQuery };

// ReadModel
export type { ConsulterActionnaireReadModel, ConsulterChangementActionnaireReadModel };

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
export type { ChangementActionnaireDemandéEvent } from './demanderChangement/demandeChangementActionnaire.behavior';
export type { DemandeChangementActionnaireAnnuléEvent } from './annulerDemandeChangement/annulerDemandeChangement.behavior';
export type { DemandeChangementActionnaireAccordéeEvent } from './accorderDemandeChangement/accorderDemandeChangement.behavior.ts';
export type { DemandeChangementActionnaireRejetéeEvent } from './rejeterDemandeChangement/rejeterDemandeChangement.behavior';

// Saga
export * as ActionnaireSaga from './actionnaire.saga';

// ValueType
export * as StatutChangementActionnaire from './statutChangementActionnaire.valueType';
export * as TypeDocumentActionnaire from './typeDocumentActionnaire.valueType';

// Entities
export * from './actionnaire.entity';
