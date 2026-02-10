import { ÉliminéNotifiéEvent } from './notifier/éliminéNotifié.event.js';
import { ÉliminéArchivéEvent } from './archiver/éliminéArchivé.event.js';
import { ÉliminéEvent } from './éliminé.event.js';
import {
  ConsulterÉliminéQuery,
  ConsulterÉliminéReadModel,
} from './consulter/consulterÉliminé.query.js';
import { ListerÉliminéQuery, ListerÉliminéReadModel } from './lister/listerÉliminé.query.js';
import {
  ListerÉliminéEnrichiQuery,
  ListerÉliminéEnrichiReadModel,
  ÉliminéEnrichiListItemReadModel,
} from './lister/listerÉliminéEnrichi.query.js';

// Query
export type ÉliminéQuery = ConsulterÉliminéQuery | ListerÉliminéQuery | ListerÉliminéEnrichiQuery;
export type { ConsulterÉliminéQuery, ListerÉliminéQuery, ListerÉliminéEnrichiQuery };

// ReadModel
export type {
  ConsulterÉliminéReadModel,
  ListerÉliminéReadModel,
  ListerÉliminéEnrichiReadModel,
  ÉliminéEnrichiListItemReadModel,
};

// UseCases

// Events
export type { ÉliminéEvent, ÉliminéNotifiéEvent, ÉliminéArchivéEvent };

// Register
export { registerEliminéUseCases, registerEliminéQueries } from './éliminé.register.js';

// Entities
export type { ÉliminéEntity } from './éliminé.entity.js';

export * as Recours from './recours/index.js';
