import type { ÉliminéArchivéEvent } from './archiver/éliminéArchivé.event.js';
import type {
  ConsulterÉliminéQuery,
  ConsulterÉliminéReadModel,
} from './consulter/consulterÉliminé.query.js';
import type { ListerÉliminéQuery, ListerÉliminéReadModel } from './lister/listerÉliminé.query.js';
import type {
  ListerÉliminéEnrichiQuery,
  ListerÉliminéEnrichiReadModel,
  ÉliminéEnrichiListItemReadModel,
} from './lister/listerÉliminéEnrichi.query.js';
import type { ÉliminéNotifiéEvent } from './notifier/éliminéNotifié.event.js';
import type { ÉliminéEvent } from './éliminé.event.js';

// Query
export type ÉliminéQuery = ConsulterÉliminéQuery | ListerÉliminéQuery | ListerÉliminéEnrichiQuery;

// ReadModel
export type {
  ConsulterÉliminéQuery,
  ConsulterÉliminéReadModel,
  ListerÉliminéEnrichiQuery,
  ListerÉliminéEnrichiReadModel,
  ListerÉliminéQuery,
  ListerÉliminéReadModel,
  ÉliminéEnrichiListItemReadModel,
};

// UseCases

export * as Recours from './recours/index.js';
// Entities
export type { ÉliminéEntity } from './éliminé.entity.js';
// Register
export { registerEliminéQueries, registerEliminéUseCases } from './éliminé.register.js';
// Events
export type { ÉliminéArchivéEvent, ÉliminéEvent, ÉliminéNotifiéEvent };
