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
export { ConsulterNombreTâchesQuery, ListerTâchesQuery as ListerTâcheQuery };

// ReadModel
export { ConsulterNombreTâchesReadModel, ListerTâchesReadModel as ListerTâcheReadModel };

// Event
export { TâcheEvent } from './tâche.aggregate';

// Saga
export * as TâcheSaga from './tâche.saga';

// Register
export * from './register';

// ValueTypes
export * as TypeTâche from './typeTâche.valueType';

// Entitys
export * from './tâche.entity';

// Port
export { RécupérerNombreTâchePort };
export { RécupérerTâchesPort };
