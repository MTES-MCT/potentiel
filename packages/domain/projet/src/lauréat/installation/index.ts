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
import {
  ConsulterTypologieInstallationQuery,
  ConsulterTypologieInstallationReadModel,
} from './typologie-installation/consulter/consulterTypologieInstallation.query';
import {
  HistoriqueTypologieInstallationProjetListItemReadModel,
  ListerHistoriqueTypologieInstallationProjetQuery,
} from './typologie-installation/listerHistorique/listerHistoriqueTypologieInstallationProjet.query';
import { ModifierTypologieInstallationUseCase } from './typologie-installation/modifier/modifierTypologieInstallation.usecase';

// Query
export type InstallationQuery =
  | ConsulterInstallationQuery
  | ConsulterTypologieInstallationQuery
  | ListerHistoriqueInstallateurProjetQuery
  | ListerHistoriqueTypologieInstallationProjetQuery;

export {
  ConsulterInstallationQuery,
  ConsulterInstallateurQuery,
  ConsulterTypologieInstallationQuery,
  ListerHistoriqueInstallateurProjetQuery,
  ListerHistoriqueTypologieInstallationProjetQuery,
};

// ReadModel
export {
  ConsulterInstallationReadModel,
  ConsulterInstallateurReadModel,
  HistoriqueInstallateurProjetListItemReadModel,
  ConsulterTypologieInstallationReadModel,
  HistoriqueTypologieInstallationProjetListItemReadModel,
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
export {
  registerInstallateurQueries,
  registerInstallateurUseCases,
} from './installateur/installateur.register';
export {
  registerTypologieInstallationQueries,
  registerTypologieInstallationUseCases,
} from './typologie-installation/typologieInstallation.register';

// Entities
export * from './installation.entity';
