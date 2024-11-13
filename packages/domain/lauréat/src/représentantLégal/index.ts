import type {
  ConsulterReprésentantLégalQuery,
  ConsulterReprésentantLégalReadModel,
} from './consulter/consulterReprésentantLégal.query';
import { CorrigerReprésentantLégalCommand } from './corriger/corrigerReprésentantLégal.command';
import { CorrigerReprésentantLégalUseCase } from './corriger/corrigerReprésentantLégal.usecase';
import { ImporterReprésentantLégalCommand } from './importer/importerReprésentantLégal.command';

// Query
export type ReprésentantLégalQuery = ConsulterReprésentantLégalQuery;
export type { ConsulterReprésentantLégalQuery };

// ReadModel
export type { ConsulterReprésentantLégalReadModel };

// Command
export type ReprésentantLégalCommand =
  | ImporterReprésentantLégalCommand
  | CorrigerReprésentantLégalCommand;

export type { ImporterReprésentantLégalCommand, CorrigerReprésentantLégalCommand };

// UseCase
export type ReprésentantLégalUseCase = CorrigerReprésentantLégalUseCase;

export type { CorrigerReprésentantLégalUseCase };

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
