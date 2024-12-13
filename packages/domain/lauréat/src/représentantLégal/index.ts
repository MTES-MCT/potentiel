import type {
  ConsulterReprésentantLégalQuery,
  ConsulterReprésentantLégalReadModel,
} from './consulter/consulterReprésentantLégal.query';
import { ModifierReprésentantLégalCommand } from './modifier/modifierReprésentantLégal.command';
import { ModifierReprésentantLégalUseCase } from './modifier/modifierReprésentantLégal.usecase';
import { ImporterReprésentantLégalCommand } from './importer/importerReprésentantLégal.command';
import { DemanderChangementReprésentantLégalUseCase } from './changement/demander/demanderChangementReprésentantLégal.usecase';
import { DemanderChangementReprésentantLégalCommand } from './changement/demander/demanderChangementReprésentantLégal.command';
import {
  ConsulterChangementReprésentantLégalQuery,
  ConsulterChangementReprésentantLégalReadModel,
} from './changement/consulter/consulterChangementReprésentantLégal.query';

// Query
export type ReprésentantLégalQuery =
  | ConsulterReprésentantLégalQuery
  | ConsulterChangementReprésentantLégalQuery;
export type { ConsulterReprésentantLégalQuery, ConsulterChangementReprésentantLégalQuery };

// ReadModel
export type { ConsulterReprésentantLégalReadModel, ConsulterChangementReprésentantLégalReadModel };

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
export type { ChangementReprésentantLégalDemandéEvent } from './changement/demander/demanderChangementReprésentantLégal.behavior';

// Register
export {
  registerReprésentantLégalQueries,
  registerReprésentantLégalUseCases,
} from './représentantLégal.register';

// Entities
export * from './représentantLégal.entity';
export type { ChangementReprésentantLégalEntity } from './changement/changementReprésentantLégal.entity';

// Aggregate
export { loadReprésentantLégalFactory } from './représentantLégal.aggregate';

// Saga
export * as ReprésentantLégalSaga from './représentantLégal.saga';

// ValueType
export * as TypeReprésentantLégal from './typeReprésentantLégal.valueType';
export * as TypeDocumentChangementReprésentantLégal from './changement/typeDocumentChangementReprésentantLégal.valueType';
export * as StatutChangementReprésentantLégal from './changement/statutChangementReprésentantLégal.valueType';
