import {
  ConsulterInstallationQuery,
  ConsulterInstallationReadModel,
} from './consulter/consulterInstallation.query';
import {
  ConsulterInstallateurQuery,
  ListerHistoriqueInstallateurProjetQuery,
  ConsulterInstallateurReadModel,
  HistoriqueInstallateurProjetListItemReadModel,
  ModifierInstallateurUseCase,
} from './installateur';

// Query
export type InstallationQuery =
  | ConsulterInstallationQuery
  | ConsulterInstallateurQuery
  | ListerHistoriqueInstallateurProjetQuery;
export {
  ConsulterInstallateurQuery,
  ListerHistoriqueInstallateurProjetQuery,
  ConsulterInstallationQuery,
};

// ReadModel
export {
  ConsulterInstallationReadModel,
  ConsulterInstallateurReadModel,
  HistoriqueInstallateurProjetListItemReadModel,
};

// UseCase
export type InstallationUseCase = ModifierInstallateurUseCase;
export { ModifierInstallateurUseCase } from './installateur/modifier/modifierInstallateur.usecase';

// Event
export { InstallationEvent } from './installation.event';

export { InstallationImportéeEvent } from './importer/importerInstallation.event';
export { InstallateurModifiéEvent } from './installateur/modifier/modifierInstallateur.event';

// Register
export { registerInstallationQueries, registerInstallationUseCases } from './installation.register';

// Entities
export * from './installation.entity';
