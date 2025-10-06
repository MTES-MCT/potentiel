import {
  ConsulterInstallateurQuery,
  ListerHistoriqueInstallateurProjetQuery,
  ConsulterInstallateurReadModel,
  HistoriqueInstallateurProjetListItemReadModel,
  ModifierInstallateurUseCase,
} from './installateur';

// Query
export type InstallationQuery =
  | ConsulterInstallateurQuery
  | ListerHistoriqueInstallateurProjetQuery;
export { ConsulterInstallateurQuery, ListerHistoriqueInstallateurProjetQuery };

// ReadModel
export { ConsulterInstallateurReadModel, HistoriqueInstallateurProjetListItemReadModel };

// UseCase
export type InstallationUseCase = ModifierInstallateurUseCase;
export { ModifierInstallateurUseCase } from './installateur/modifier/modifierInstallateur.usecase';

// Event
export { InstallationEvent } from './installation.event';

export { InstallationImportéeEvent } from './importer/importerInstalltion.event';
export { InstallateurModifiéEvent } from './installateur/modifier/modifierInstallateur.event';

// Register
export { registerInstallationQueries, registerInstallationUseCases } from './installation.register';

// Entities
export * from './installation.entity';
export * from './installateur/installateur.entity';
