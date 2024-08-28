import type {
  ConsulterPériodeQuery,
  ConsulterPériodeReadModel,
} from './consulter/consulterPériode.query';

// Query
export type PériodeQuery = ConsulterPériodeQuery;
export type { ConsulterPériodeQuery };

// Read Models
export type { ConsulterPériodeReadModel };

// Register
export * from './register';

// Entity
export * from './période.entity';
