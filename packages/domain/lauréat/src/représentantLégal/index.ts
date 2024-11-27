import type {
  ConsulterReprésentantLégalQuery,
  ConsulterReprésentantLégalReadModel,
} from './consulter/consulterReprésentantLégal.query';
import { ModifierReprésentantLégalCommand } from './modifier/modifierReprésentantLégal.command';
import { ModifierReprésentantLégalUseCase } from './modifier/modifierReprésentantLégal.usecase';
import { ImporterReprésentantLégalCommand } from './importer/importerReprésentantLégal.command';

// Query
export type ReprésentantLégalQuery = ConsulterReprésentantLégalQuery;
export type { ConsulterReprésentantLégalQuery };

// ReadModel
export type { ConsulterReprésentantLégalReadModel };

// Command
export type ReprésentantLégalCommand =
  | ImporterReprésentantLégalCommand
  | ModifierReprésentantLégalCommand;

export type { ImporterReprésentantLégalCommand, ModifierReprésentantLégalCommand };

// UseCase
export type ReprésentantLégalUseCase = ModifierReprésentantLégalUseCase;

export type { ModifierReprésentantLégalUseCase };

// Event
export type { ReprésentantLégalEvent } from './représentantLégal.aggregate';

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
