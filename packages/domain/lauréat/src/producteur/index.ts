import {
  ConsulterChangementProducteurQuery,
  ConsulterChangementProducteurReadModel,
} from './changement/consulter/consulterChangementProducteur.query';
import { EnregistrerChangementProducteurCommand } from './changement/enregistrerChangement/enregistrerChangementProducteur.command';
import { EnregistrerChangementProducteurUseCase } from './changement/enregistrerChangement/enregistrerChangementProducteur.usecase';
import {
  ConsulterProducteurQuery,
  ConsulterProducteurReadModel,
} from './consulter/consulterProducteur.query';
import {
  ListerChangementProducteurQuery,
  ListerChangementProducteurReadModel,
} from './changement/lister/listerChangementProducteur.query';
import { ImporterProducteurCommand } from './importer/importerProducteur.command';

// Query
export type ProducteurQuery =
  | ConsulterProducteurQuery
  | ConsulterChangementProducteurQuery
  | ListerChangementProducteurQuery;

export type {
  ConsulterProducteurQuery,
  ConsulterChangementProducteurQuery,
  ListerChangementProducteurQuery,
};

// ReadModel
export type {
  ConsulterProducteurReadModel,
  ConsulterChangementProducteurReadModel,
  ListerChangementProducteurReadModel,
};

// UseCase
export type ProducteurUseCase = EnregistrerChangementProducteurUseCase;
export type { EnregistrerChangementProducteurUseCase };

// Command
export type ProducteurCommand = ImporterProducteurCommand | EnregistrerChangementProducteurCommand;
export type { ImporterProducteurCommand, EnregistrerChangementProducteurCommand };

// Event
export type { ProducteurEvent } from './producteur.aggregate';
export type { ProducteurImportéEvent } from './importer/importerProducteur.behavior';
export type { ChangementProducteurEnregistréEvent } from './changement/enregistrerChangement/enregistrerChangementProducteur.behavior';

// Saga
export * as ProducteurSaga from './saga';

// Entity
export * from './producteur.entity';
export * from './changement/changementProducteur.entity';

// ValueType
export * as TypeDocumentProducteur from './typeDocumentProducteur.valueType';
