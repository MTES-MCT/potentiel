import type { TâcheAchevéeEvent } from './achever/acheverTâche.event.js';
import type {
  TâcheAjoutéeEvent,
  TâcheRelancéeEvent,
  TâcheRenouvelléeEvent,
} from './ajouter/ajouterTâche.event.js';
import type {
  ConsulterNombreTâchesQuery,
  ConsulterNombreTâchesReadModel,
} from './consulter/consulterNombreTâche.query.js';
import type { ListerTâchesQuery, ListerTâchesReadModel } from './lister/listerTâche.query.js';

// Query
export type TâcheQuery = ConsulterNombreTâchesQuery & ListerTâchesQuery;

// Register
export * from './register.js';
// ValueTypes
export * as TypeTâche from './typeTâche.valueType.js';
// Entities
export type * from './tâche.entity.js';
// Event
export type * from './tâche.event.js';
// ReadModel
export type {
  ConsulterNombreTâchesQuery,
  ConsulterNombreTâchesReadModel,
  ListerTâchesQuery,
  ListerTâchesReadModel,
  TâcheAchevéeEvent,
  TâcheAjoutéeEvent,
  TâcheRelancéeEvent,
  TâcheRenouvelléeEvent,
};
