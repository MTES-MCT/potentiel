import { TâcheAchevéeEvent } from './achever/acheverTâche.event.js';
import {
  TâcheAjoutéeEvent,
  TâcheRenouvelléeEvent,
  TâcheRelancéeEvent,
} from './ajouter/ajouterTâche.event.js';
import {
  ConsulterNombreTâchesQuery,
  ConsulterNombreTâchesReadModel,
} from './consulter/consulterNombreTâche.query.js';
import { ListerTâchesQuery, ListerTâchesReadModel } from './lister/listerTâche.query.js';

// Query
export type TâcheQuery = ConsulterNombreTâchesQuery & ListerTâchesQuery;
export type { ConsulterNombreTâchesQuery, ListerTâchesQuery };

// ReadModel
export type { ConsulterNombreTâchesReadModel, ListerTâchesReadModel };

// Event
export type * from './tâche.event.js';
export type { TâcheAjoutéeEvent, TâcheRenouvelléeEvent, TâcheRelancéeEvent, TâcheAchevéeEvent };

// Register
export * from './register.js';

// ValueTypes
export * as TypeTâche from './typeTâche.valueType.js';

// Entities
export type * from './tâche.entity.js';
