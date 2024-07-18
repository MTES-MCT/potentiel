import {
  ConsulterNombreTâchesQuery,
  ConsulterNombreTâchesReadModel,
} from './consulter/consulterNombreTâches.query';
import { ListerTâchesQuery, ListerTâchesReadModel } from './lister/listerTâches.query';
import {
  ListerTâchesPlanifiéesQuery,
  ListerTâchesPlanifiéesReadModel,
} from './lister/listerTâchesPlanifiées.query';

// Query
export type TâcheQuery = ConsulterNombreTâchesQuery | ListerTâchesQuery;
export { ConsulterNombreTâchesQuery, ListerTâchesQuery, ListerTâchesPlanifiéesQuery };

// ReadModel
export { ConsulterNombreTâchesReadModel, ListerTâchesReadModel, ListerTâchesPlanifiéesReadModel };

// Event
export { TâcheEvent } from './tâche.aggregate';

// Saga
export * as TâcheAbandonSaga from './saga/tâcheAbandon.saga';
export * as TâcheGarantiesFinancièresSaga from './saga/tâcheGarantiesFinancières.saga';
export * as TâcheRaccordementSaga from './saga/tâcheRaccordement.saga';

// Register
export * from './register';

// ValueTypes
export * as TypeTâche from './typeTâche.valueType';

// Entities
export * from './tâche.entity';
