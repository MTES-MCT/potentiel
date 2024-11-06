import type {
  ConsulterReprésentantLégalQuery,
  ConsulterReprésentantLégalReadModel,
} from './consulter/consulterReprésentantLégal.query';
import { ImporterReprésentantLégalUseCase } from './importer/importerReprésentantLégal.usecase';

// Query
export type ReprésentantLégalQuery = ConsulterReprésentantLégalQuery;
export type { ConsulterReprésentantLégalQuery };

// ReadModel
export type { ConsulterReprésentantLégalReadModel };

// UseCases
export type ReprésentantLégalUseCase = ImporterReprésentantLégalUseCase;

export type { ImporterReprésentantLégalUseCase };

// Event
export type { ReprésentantLégalEvent } from './représentantLégal.aggregate';

// Register
export {
  registerReprésentantLégalQueries,
  registerReprésentantLégalUseCases,
} from './représentantLégal.register';

// ValueTypes

// Entities
export * from './représentantLégal.entity';

// Aggregate
export { loadReprésentantLégalFactory } from './représentantLégal.aggregate';
