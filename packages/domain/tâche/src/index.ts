import {
  ConsulterNombreTâchesQuery,
  ConsulterNombreTâchesReadModel,
  RécupérerNombreTâchePort,
} from './consulter/consulterNombreTâches.query';
import { ListerTâcheQuery, ListerTâcheReadModel } from './lister/listerTâches.query';

// Query
export type TâcheQuery = ConsulterNombreTâchesQuery | ListerTâcheQuery;
export { ConsulterNombreTâchesQuery, ListerTâcheQuery };

// ReadModel
export { ConsulterNombreTâchesReadModel, ListerTâcheReadModel };

// Event
export { TâcheEvent } from './tâche.aggregate';

// Saga
export * as TâcheSaga from './tâche.saga';

// Register
export * from './register';

// ValueTypes
export * as TypeTâche from './typeTâche.valueType';

// Projections
export * from './tâche.projection';

// Port
export { RécupérerNombreTâchePort };
