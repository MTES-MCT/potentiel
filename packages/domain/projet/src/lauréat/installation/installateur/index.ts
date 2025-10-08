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

export { InstallationImportéeEvent as InstallateurImportéEvent } from '../importer/importerInstallation.event';
export { InstallateurModifiéEvent } from './modifier/modifierInstallateur.event';

// Register
export { registerInstallateurQueries, registerInstallateurUseCases } from './installateur.register';
