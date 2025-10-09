import {
  ConsulterInstallationQuery,
  ConsulterInstallationReadModel,
} from './consulter/consulterInstallation.query';
import {
  ConsulterInstallateurQuery,
  ConsulterInstallateurReadModel,
} from './installateur/consulter/consulterInstallateur.query';
import {
  HistoriqueInstallateurProjetListItemReadModel,
  ListerHistoriqueInstallateurProjetQuery,
} from './installateur/listerHistorique/listerHistoriqueInstallateurProjet.query';
import { ModifierInstallateurUseCase } from './installateur/modifier/modifierInstallateur.usecase';

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
export { TypologieInstallationModifiéeEvent } from './typologie-installation/modifier/modifierTypologieInstallation.event';

// Register
export { registerInstallationQueries, registerInstallationUseCases } from './installation.register';
export {
  registerInstallateurQueries,
  registerInstallateurUseCases,
} from './installateur/installateur.register';

// Entities
export * from './installation.entity';
