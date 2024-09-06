import type {
  ConsulterPériodeQuery,
  ConsulterPériodeReadModel,
} from './consulter/consulterPériode.query';
import type { ListerPériodesQuery, ListerPériodesReadModel } from './lister/listerPériode.query';
import { PériodeNotifiéeEvent } from './notifier/notifierPériode.behavior';
import type { NotifierPériodeUseCase } from './notifier/notifierPériode.usecase';

// Query
export type PériodeQuery = ConsulterPériodeQuery | ListerPériodesQuery;
export type { ConsulterPériodeQuery, ListerPériodesQuery };

// Read Models
export type { ConsulterPériodeReadModel, ListerPériodesReadModel };

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
