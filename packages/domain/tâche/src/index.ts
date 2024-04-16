import {
  ConsulterNombreTâchesQuery,
  ConsulterNombreTâchesReadModel,
} from './consulter/consulterNombreTâches.query';
import {
  ListerTâchesQuery,
  ListerTâchesReadModel,
  RécupérerTâchesPort,
} from './lister/listerTâches.query';

// Query
export type TâcheQuery = ConsulterNombreTâchesQuery | ListerTâchesQuery;
export { ConsulterNombreTâchesQuery, ListerTâchesQuery };

// ReadModel
export { ConsulterNombreTâchesReadModel, ListerTâchesReadModel };

// Event
export { TâcheEvent } from './tâche.aggregate';

// Saga
export * as TâcheSaga from './tâche.saga';

// Register
export * from './register';

// ValueTypes
export * as TypeTâche from './typeTâche.valueType';

// Entities
export * from './tâche.entity';

// Port
export { RécupérerTâchesPort };
