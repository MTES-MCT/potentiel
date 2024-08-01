import { AcheverTâcheCommand } from './achever/acheverTâche.command';
import { AjouterTâcheCommand } from './ajouter/ajouterTâche.command';
import {
  ConsulterNombreTâchesQuery,
  ConsulterNombreTâchesReadModel,
} from './consulter/consulterNombreTâches.query';
import { ListerTâchesQuery, ListerTâchesReadModel } from './lister/listerTâches.query';

// Query
export type TâcheQuery = ConsulterNombreTâchesQuery | ListerTâchesQuery;
export { ConsulterNombreTâchesQuery, ListerTâchesQuery };

// Command
export type TâcheCommand = AjouterTâcheCommand | AcheverTâcheCommand;
export { AjouterTâcheCommand, AcheverTâcheCommand };

// ReadModel
export { ConsulterNombreTâchesReadModel, ListerTâchesReadModel };

// Event
export { TâcheEvent } from './tâche.aggregate';

// Register
export * from './register';

// Entities
export * from './tâche.entity';
