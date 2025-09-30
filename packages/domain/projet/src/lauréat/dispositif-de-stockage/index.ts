import {
  ConsulterDispositifDeStockageQuery,
  ConsulterDispositifDeStockageReadModel,
} from './consulter/consulterDispositifDeStockage.query';
import {
  ListerHistoriqueDispositifDeStockageProjetQuery,
  HistoriqueDispositifDeStockageProjetListItemReadModel,
} from './listerHistorique/ListerHistoriqueDispositifDeStockageProjet.query';

// UseCase
export { ModifierDispositifDeStockageUseCase } from './modifier/modifierDispositifDeStockage.usecase';

// Query
export type DispositifDeStockageQuery =
  | ConsulterDispositifDeStockageQuery
  | ListerHistoriqueDispositifDeStockageProjetQuery;

export { ConsulterDispositifDeStockageQuery, ListerHistoriqueDispositifDeStockageProjetQuery };

// ReadModel
export {
  ConsulterDispositifDeStockageReadModel,
  HistoriqueDispositifDeStockageProjetListItemReadModel,
};

// Event
export { DispositifDeStockageEvent } from './dispositifDeStockage.event';
export { DispositifDeStockageImportéEvent } from './importer/importerDispositifDeStockage.event';
export { DispositifDeStockageModifiéEvent } from './modifier/modifierDispositifDeStockage.event';

// Register
export {
  registerDispositifDeStockageQueries,
  registerDispositifDeStockageUseCase,
} from './dispositifDeStockage.register';

// Entities
export * from './dispositifDeStockage.entity';

// Value type
export * as DispositifDeStockage from './dispositifDeStockage.valueType';
