import {
  ConsulterChangementProducteurQuery,
  ConsulterChangementProducteurReadModel,
} from './changement/consulter/consulterChangementProducteur.query';
import { EnregistrerChangementProducteurUseCase } from './changement/enregistrerChangement/enregistrerChangement.usecase';
import {
  ListerChangementProducteurQuery,
  ListerChangementProducteurReadModel,
} from './changement/lister/listerChangementProducteur.query';
import {
  ConsulterProducteurQuery,
  ConsulterProducteurReadModel,
} from './consulter/consulterProducteur.query';

// Query
export type ProducteurQuery =
  | ConsulterProducteurQuery
  | ConsulterChangementProducteurQuery
  | ListerChangementProducteurQuery;

export {
  ConsulterProducteurQuery,
  ConsulterChangementProducteurQuery,
  ListerChangementProducteurQuery,
};

// ReadModel
export {
  ConsulterProducteurReadModel,
  ConsulterChangementProducteurReadModel,
  ListerChangementProducteurReadModel,
};

// UseCases
export type ProducteurUseCase = EnregistrerChangementProducteurUseCase;

export { EnregistrerChangementProducteurUseCase };

// Event
export { ProducteurEvent } from './producteur.event';
export { ChangementProducteurEnregistréEvent } from './changement/enregistrerChangement/enregistrerChangement.event';

// Register
export { registerProducteurQueries, registerProducteurUseCases } from './producteur.register';

// ValueTypes
export * as TypeDocumentProducteur from './typeDocumentProducteur.valueType';

// Entities
export * from './producteur.entity';
