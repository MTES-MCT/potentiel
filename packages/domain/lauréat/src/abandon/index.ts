import {
  ConsulterAbandonQuery,
  ConsulterAbandonReadModel,
} from './consulter/consulterAbandon.query';
import { ListerAbandonsQuery, ListerAbandonReadModel } from './lister/listerAbandons.query';
import { ListerAbandonsAvecRecandidatureÀRelancerQuery } from './lister/listerAbandonsAvecRecandidatureÀRelancer.query';

// Query
export type AbandonQuery =
  | ConsulterAbandonQuery
  | ListerAbandonsQuery
  | ListerAbandonsAvecRecandidatureÀRelancerQuery;

export type {
  ConsulterAbandonQuery,
  ListerAbandonsQuery,
  ListerAbandonsAvecRecandidatureÀRelancerQuery,
};

// ReadModel
export type { ConsulterAbandonReadModel, ListerAbandonReadModel };

// Register
export { registerAbandonQueries, registerAbandonUseCases } from './abandon.register';

// Entities
export * from './abandon.entity';
