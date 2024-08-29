import type {
  ConsulterPériodeQuery,
  ConsulterPériodeReadModel,
} from './consulter/consulterPériode.query';
import { PériodeNotifiéeEvent } from './notifier/notifierPériode.behavior';
import type { NotifierPériodeUseCase } from './notifier/notifierPériode.usecase';

// Query
export type PériodeQuery = ConsulterPériodeQuery;
export type { ConsulterPériodeQuery };

// Read Models
export type { ConsulterPériodeReadModel };

// UseCases
export type PériodeUseCase = NotifierPériodeUseCase;
export type { NotifierPériodeUseCase };

// Events
export type { PériodeNotifiéeEvent };

// Register
export { registerPériodeQueries } from './register';

// Entity
export * from './période.entity';

// Value types
export * as IdentifiantPériode from './identifiantPériode.valueType';
