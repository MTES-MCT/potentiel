import type {
  ConsulterReprésentantLégalQuery,
  ConsulterReprésentantLégalReadModel,
} from './consulter/consulterReprésentantLégal.query';
import { ModifierReprésentantLégalCommand } from './modifier/modifierReprésentantLégal.command';
import { ModifierReprésentantLégalUseCase } from './modifier/modifierReprésentantLégal.usecase';
import { ImporterReprésentantLégalCommand } from './importer/importerReprésentantLégal.command';
import { DemanderChangementReprésentantLégalUseCase } from './demandeChangement/demander/demanderChangementReprésentantLégal.usecase';
import { DemanderChangementReprésentantLégalCommand } from './demandeChangement/demander/demanderChangementReprésentantLégal.command';

// Query
export type ReprésentantLégalQuery = ConsulterReprésentantLégalQuery;
export type { ConsulterReprésentantLégalQuery };

// ReadModel
export type { ConsulterReprésentantLégalReadModel };

// Command
export type ReprésentantLégalCommand =
  | ImporterReprésentantLégalCommand
  | ModifierReprésentantLégalCommand
  | DemanderChangementReprésentantLégalCommand;

export type {
  ImporterReprésentantLégalCommand,
  ModifierReprésentantLégalCommand,
  DemanderChangementReprésentantLégalCommand,
};

// UseCase
export type ReprésentantLégalUseCase =
  | ModifierReprésentantLégalUseCase
  | DemanderChangementReprésentantLégalUseCase;

export type { ModifierReprésentantLégalUseCase, DemanderChangementReprésentantLégalUseCase };

// Event
export type { ReprésentantLégalEvent } from './représentantLégal.aggregate';
export type { ReprésentantLégalImportéEvent } from './importer/importerReprésentantLégal.behavior';
export type { ReprésentantLégalModifiéEvent } from './modifier/modifierReprésentantLégal.behavior';

// Register
export {
  registerReprésentantLégalQueries,
  registerReprésentantLégalUseCases,
} from './représentantLégal.register';

// Entities
export * from './représentantLégal.entity';

// Aggregate
export { loadReprésentantLégalFactory } from './représentantLégal.aggregate';

// Saga
export * as ReprésentantLégalSaga from './représentantLégal.saga';

// ValueType
export * as TypeReprésentantLégal from './typeReprésentantLégal.valueType';
export * as TypeDocumentChangementReprésentantLégal from './demandeChangement/typeDocumentChangementReprésentantLégal.valueType';
export * as StatutDemandeChangementReprésentantLégal from './demandeChangement/statutDemandeChangementReprésentantLégal.valueType';
