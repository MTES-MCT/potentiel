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

// la commande est exceptionnellement exportée pour utilisation dans la CLI, mais ne doit en aucun cas être utilisée directement. Utiliser l'aggrégat Tâche.
export { AcheverTâcheCommand } from './achever/acheverTâche.command';

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
