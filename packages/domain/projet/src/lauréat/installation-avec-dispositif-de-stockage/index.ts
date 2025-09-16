import {
  ConsulterInstallationAvecDispositifDeStockageQuery,
  ConsulterInstallationAvecDispositifDeStockageReadModel,
} from './consulter/consulterInstallationAvecDispositifDeStockage.query';
import {
  HistoriqueInstallationAvecDispositifDeStockageProjetListItemReadModel,
  ListerHistoriqueInstallationAvecDispositifDeStockageProjetQuery,
} from './listerHistorique/ListerHistoriqueInstallationAvecDispositifDeStockageProjet.query';

// UseCase
export { ModifierInstallationAvecDispositifDeStockageUseCase } from './modifier/modifierInstallationAvecDispositifDeStockage.usecase';

// Query
export type InstallationAvecDispositifDeStockageQuery =
  | ConsulterInstallationAvecDispositifDeStockageQuery
  | ListerHistoriqueInstallationAvecDispositifDeStockageProjetQuery;

export {
  ConsulterInstallationAvecDispositifDeStockageQuery,
  ListerHistoriqueInstallationAvecDispositifDeStockageProjetQuery,
};

// ReadModel
export {
  ConsulterInstallationAvecDispositifDeStockageReadModel,
  HistoriqueInstallationAvecDispositifDeStockageProjetListItemReadModel,
};

// Event
export { InstallationAvecDispositifDeStockageEvent } from './installationAvecDispositifDeStockage.event';
export { InstallationAvecDispositifDeStockageImportéeEvent } from './importer/importerInstallationAvecDispositifDeStockage.event';
export { InstallationAvecDispositifDeStockageModifiéeEvent } from './modifier/modifierInstallationAvecDispositifDeStockage.event';

// Register
export {
  registerInstallationAvecDispositifDeStockageQueries,
  registerInstallationAvecDispositifDeStockageUseCase,
} from './installationAvecDispositifDeStockage.register';

// Entities
export * from './installationAvecDispositifDeStockage.entity';
