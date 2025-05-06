import {
  ConsulterProducteurQuery,
  ConsulterProducteurReadModel,
} from './consulter/consulterProducteur.query';
import { DemanderProducteurUseCase } from './demander/demanderProducteur.usecase';
import { ListerProducteurQuery, ListerProducteurReadModel } from './lister/listerProducteur.query';

// Query
export type ProducteurQuery = ConsulterProducteurQuery | ListerProducteurQuery;

export { ConsulterProducteurQuery, ListerProducteurQuery };

// ReadModel
export { ConsulterProducteurReadModel, ListerProducteurReadModel };

// UseCases
export type ProducteurUseCase = DemanderProducteurUseCase;

export { DemanderProducteurUseCase };

// Event
// export { ProducteurEvent } from './producteur.event';
export { ProducteurDemandéEvent } from './demander/demanderProducteur.event';

// Register
export { registerProducteurQueries, registerProducteurUseCases } from './producteur.register';

// ValueTypes
export * as TypeDocumentProducteur from './typeDocumentProducteur.valueType';

// Entities
export * from './producteur.entity';
