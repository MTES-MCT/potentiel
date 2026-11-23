/** biome-ignore-all assist/source/organizeImports: organized by hand for this index */

import type {
  ConsulterPériodeQuery,
  ConsulterPériodeReadModel,
} from './consulter/consulterPériode.query.js';
import type { InitierImportPériodeUseCase } from './importer/initierImportPériode.usecase.js';
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
export type PériodeUseCase = NotifierPériodeUseCase | InitierImportPériodeUseCase;
export type { InitierImportPériodeUseCase, NotifierPériodeUseCase, PériodeNotifiéeEvent };

// Value types
export * as IdentifiantPériode from './identifiantPériode.valueType.js';
export * as StatutPériode from './statutPériode.valueType.js';

// Entity
export type * from './période.entity.js';

// Events
export { PériodeEvent } from './période.event.js';

// Register
export { registerPériodeQueries, registerPériodeUseCases } from './register.js';

// Port
export * from './port/récupérerProjetsPériode.port.js';
