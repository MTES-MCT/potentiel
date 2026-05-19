import type {
  ConsulterPériodeQuery,
  ConsulterPériodeReadModel,
} from './consulter/consulterPériode.query.js';
import type {
  ListerPériodeItemReadModel,
  ListerPériodesQuery,
  ListerPériodesReadModel,
} from './lister/listerPériodes.query.js';
import type { PériodeNotifiéeEvent } from './notifier/notifierPériode.event.js';
import type { NotifierPériodeUseCase } from './notifier/notifierPériode.usecase.js';

// Query
export type PériodeQuery = ConsulterPériodeQuery | ListerPériodesQuery;

// Read Models
export type {
  ConsulterPériodeQuery,
  ConsulterPériodeReadModel,
  ListerPériodeItemReadModel,
  ListerPériodesQuery,
  ListerPériodesReadModel,
};

// UseCases
export type PériodeUseCase = NotifierPériodeUseCase;
export type { NotifierPériodeUseCase };

// Events
export type PériodeEvent = PériodeNotifiéeEvent;

// Value types
export * as IdentifiantPériode from './identifiantPériode.valueType.js';
// Entity
export type * from './période.entity.js';
// Register
export { registerPériodeQueries, registerPériodeUseCases } from './register.js';
export type { PériodeNotifiéeEvent };
