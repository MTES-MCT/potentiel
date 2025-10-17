import {
  ConsulterInstallationQuery,
  ConsulterInstallationReadModel,
} from './consulter/consulterInstallation.query';
import {
  ConsulterInstallateurQuery,
  ConsulterInstallateurReadModel,
} from './installateur/consulter/consulterInstallateur.query';
import { ModifierInstallateurUseCase } from './installateur/modifier/modifierInstallateur.usecase';
import {
  HistoriqueInstallationProjetListItemReadModel,
  ListerHistoriqueInstallationProjetQuery,
} from './listerHistorique/listerHistoriqueInstallationProjet.query';
import {
  ConsulterTypologieInstallationQuery,
  ConsulterTypologieInstallationReadModel,
} from './typologie-installation/consulter/consulterTypologieInstallation.query';
import { ModifierTypologieInstallationUseCase } from './typologie-installation/modifier/modifierTypologieInstallation.usecase';

// Query
export type InstallationQuery =
  | ConsulterInstallationQuery
  | ConsulterTypologieInstallationQuery
  | ListerHistoriqueInstallationProjetQuery;

export {
  ConsulterInstallationQuery,
  ConsulterInstallateurQuery,
  ConsulterTypologieInstallationQuery,
  ListerHistoriqueInstallationProjetQuery,
};

// ReadModel
export {
  ConsulterInstallationReadModel,
  ConsulterInstallateurReadModel,
  HistoriqueInstallationProjetListItemReadModel,
  ConsulterTypologieInstallationReadModel,
};

// UseCase
export type InstallationUseCase =
  | ModifierInstallateurUseCase
  | ModifierTypologieInstallationUseCase;
export { ModifierInstallateurUseCase } from './installateur/modifier/modifierInstallateur.usecase';
export { ModifierTypologieInstallationUseCase } from './typologie-installation/modifier/modifierTypologieInstallation.usecase';

// Event
export { InstallationEvent } from './installation.event';
export { InstallationImportéeEvent } from './importer/importerInstallation.event';
export { InstallateurModifiéEvent } from './installateur/modifier/modifierInstallateur.event';
export { TypologieInstallationModifiéeEvent } from './typologie-installation/modifier/modifierTypologieInstallation.event';

// Register
export { registerInstallationQueries, registerInstallationUseCases } from './installation.register';

// Entities
export * from './installation.entity';
