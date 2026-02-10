import type {
  ConsulterPériodeQuery,
  ConsulterPériodeReadModel,
} from './consulter/consulterPériode.query.js';
import type {
  ListerPériodeItemReadModel,
  ListerPériodesQuery,
  ListerPériodesReadModel,
} from './lister/listerPériodes.query.js';
import { PériodeNotifiéeEvent } from './notifier/notifierPériode.event.js';
import type { NotifierPériodeUseCase } from './notifier/notifierPériode.usecase.js';

// Query
export type PériodeQuery = ConsulterPériodeQuery | ListerPériodesQuery;
export type { ConsulterPériodeQuery, ListerPériodesQuery };

// Read Models
export type { ConsulterPériodeReadModel, ListerPériodesReadModel, ListerPériodeItemReadModel };

// UseCases
export type PériodeUseCase = NotifierPériodeUseCase;
export type { NotifierPériodeUseCase };

// Events
export type PériodeEvent = PériodeNotifiéeEvent;
export type { PériodeNotifiéeEvent };

// Register
export { registerPériodeQueries, registerPériodeUseCases } from './register.js';

// Entity
export type * from './période.entity.js';

// Value types
export * as IdentifiantPériode from './identifiantPériode.valueType.js';
