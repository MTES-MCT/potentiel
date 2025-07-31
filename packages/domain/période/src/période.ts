import type {
  ConsulterPériodeQuery,
  ConsulterPériodeReadModel,
} from './consulter/consulterPériode.query';
import type {
  ListerPériodeItemReadModel,
  ListerPériodesQuery,
  ListerPériodesReadModel,
} from './lister/listerPériodes.query';
import { PériodeNotifiéeEvent } from './notifier/notifierPériode.event';
import type { NotifierPériodeUseCase } from './notifier/notifierPériode.usecase';

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
export { registerPériodeQueries, registerPériodeUseCases } from './register';

// Entity
export * from './période.entity';

// Value types
export * as IdentifiantPériode from './identifiantPériode.valueType';
