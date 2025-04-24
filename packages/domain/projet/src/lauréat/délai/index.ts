import {
  ConsulterDélaiQuery,
  ConsulterABénéficiéDuDélaiCDC2022Port,
} from './consulter/consulterABénéficiéDuDélaiCDC2022.query';

// Query

export type DélaiQuery = ConsulterDélaiQuery;
export { ConsulterDélaiQuery };

// ReadModel

// UseCases

// Event

// Register
export * from './délai.register';

// Port
export { ConsulterABénéficiéDuDélaiCDC2022Port };

// ValueTypes

// Entities
