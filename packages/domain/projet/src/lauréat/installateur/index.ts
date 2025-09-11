import {
  ConsulterInstallateurQuery,
  ConsulterInstallateurReadModel,
} from './consulter/consulterInstallateur.query';
import {
  HistoriqueInstallateurProjetListItemReadModel,
  ListerHistoriqueInstallateurProjetQuery,
} from './listerHistorique/listerHistoriqueInstallateurProjet.query';
import { ModifierInstallateurUseCase } from './modifier/modifierInstallateur.usecase';

// Query
export type InstallateurQuery =
  | ConsulterInstallateurQuery
  | ListerHistoriqueInstallateurProjetQuery;
export { ConsulterInstallateurQuery, ListerHistoriqueInstallateurProjetQuery };

// ReadModel
export { ConsulterInstallateurReadModel, HistoriqueInstallateurProjetListItemReadModel };

// UseCase
export type InstallateurUseCase = ModifierInstallateurUseCase;
export { ModifierInstallateurUseCase } from './modifier/modifierInstallateur.usecase';

// Event
export { InstallateurEvent } from './installateur.event';

export { InstallateurImportéEvent } from './importer/importerInstallateur.event';
export { InstallateurModifiéEvent } from './modifier/modifierInstallateur.event';

// Register
export { registerInstallateurQueries, registerInstallateurUseCases } from './installateur.register';

// Entities
export * from './installateur.entity';
