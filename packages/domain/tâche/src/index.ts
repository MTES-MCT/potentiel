import { AcheverTâcheCommand } from './achever/acheverTâche.command';
import { AjouterTâcheCommand } from './ajouter/ajouterTâche.command';
import {
  ConsulterNombreTâchesQuery,
  ConsulterNombreTâchesReadModel,
  RécupérerNombreTâchePort,
} from './consulter/consulterNombreTâches.query';
import {
  ListerTâchesQuery,
  ListerTâchesReadModel,
  RécupérerTâchesPort,
} from './lister/listerTâches.query';

// Query
export type TâcheQuery = ConsulterNombreTâchesQuery | ListerTâchesQuery;
export { ConsulterNombreTâchesQuery, ListerTâchesQuery };

// Command
export type TâcheCommand = AjouterTâcheCommand | AcheverTâcheCommand;
export { AjouterTâcheCommand, AcheverTâcheCommand };

// ReadModel
export { ConsulterNombreTâchesReadModel, ListerTâchesReadModel as ListerTâcheReadModel };

// Event
export { TâcheEvent } from './tâche.aggregate';

// Register
export * from './register';

// ValueTypes
export * as TypeTâche from './typeTâche.valueType';

// Entities
export * from './tâche.entity';

// Port
export { RécupérerNombreTâchePort };
export { RécupérerTâchesPort };
