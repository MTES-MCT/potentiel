import {
  ConsulterNombreTâchesQuery,
  ConsulterNombreTâchesReadModel,
} from './consulter/consulterNombreTâches.query';
import { ListerTâchesQuery, ListerTâchesReadModel } from './lister/listerTâches.query';

// Query
export type TâcheQuery = ConsulterNombreTâchesQuery | ListerTâchesQuery;
export { ConsulterNombreTâchesQuery, ListerTâchesQuery };

// Command
export { AcheverTâcheCommand } from './achever/acheverTâche.command';

// ReadModel
export { ConsulterNombreTâchesReadModel, ListerTâchesReadModel };

export type { TâcheAchevéeEvent } from './achever/acheverTâche.behavior';
export type {
  TâcheAjoutéeEvent,
  TâcheRelancéeEvent,
  TâcheRenouvelléeEvent,
} from './ajouter/ajouterTâche.behavior';
// Saga
export * as TâcheAbandonSaga from './saga/tâcheAbandon.saga';
export * as TâcheGarantiesFinancièresSaga from './saga/tâcheGarantiesFinancières.saga';
export * as TâcheRaccordementSaga from './saga/tâcheRaccordement.saga';
// ValueTypes
export * as TypeTâche from './typeTâche.valueType';
// Event
export { TâcheEvent } from './tâche.aggregate';
// Entities
export * from './tâche.entity';
