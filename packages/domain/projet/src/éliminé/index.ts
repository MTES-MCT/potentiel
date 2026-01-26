import { ÉliminéNotifiéEvent } from './notifier/éliminéNotifié.event';
import { ÉliminéArchivéEvent } from './archiver/éliminéArchivé.event';
import { ÉliminéEvent } from './éliminé.event';
import {
  ConsulterÉliminéQuery,
  ConsulterÉliminéReadModel,
} from './consulter/consulterÉliminé.query';
import { ListerÉliminéQuery, ListerÉliminéReadModel } from './lister/listerÉliminé.query';
import {
  ListerÉliminéEnrichiQuery,
  ListerÉliminéEnrichiReadModel,
  ÉliminéEnrichiListItemReadModel,
} from './lister/listerÉliminéEnrichi.query';

// Query
export type ÉliminéQuery = ConsulterÉliminéQuery | ListerÉliminéQuery | ListerÉliminéEnrichiQuery;
export { ConsulterÉliminéQuery, ListerÉliminéQuery, ListerÉliminéEnrichiQuery };

// ReadModel
export {
  ConsulterÉliminéReadModel,
  ListerÉliminéReadModel,
  ListerÉliminéEnrichiReadModel,
  ÉliminéEnrichiListItemReadModel,
};

// UseCases

// Events
export { ÉliminéEvent, ÉliminéNotifiéEvent, ÉliminéArchivéEvent };

// Register
export { registerEliminéUseCases, registerEliminéQueries } from './éliminé.register';

// Entities
export { ÉliminéEntity } from './éliminé.entity';

export * as Recours from './recours';
