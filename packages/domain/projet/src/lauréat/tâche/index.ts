import { TâcheAchevéeEvent } from './achever/acheverTâche.event';
import {
  TâcheAjoutéeEvent,
  TâcheRenouvelléeEvent,
  TâcheRelancéeEvent,
} from './ajouter/ajouterTâche.event';
import {
  ConsulterNombreTâchesQuery,
  ConsulterNombreTâchesReadModel,
} from './consulter/consulterNombreTâche.query';
import { ListerTâchesQuery, ListerTâchesReadModel } from './lister/listerTâche.query';

// Query
export type TâcheQuery = ConsulterNombreTâchesQuery & ListerTâchesQuery;
export type { ConsulterNombreTâchesQuery, ListerTâchesQuery };

// ReadModel
export type { ConsulterNombreTâchesReadModel, ListerTâchesReadModel };

// Event
export * from './tâche.event';
export { TâcheAjoutéeEvent, TâcheRenouvelléeEvent, TâcheRelancéeEvent, TâcheAchevéeEvent };

// Register
export * from './register';

// ValueTypes
export * as TypeTâche from './typeTâche.valueType';

// Entities
export * from './tâche.entity';
