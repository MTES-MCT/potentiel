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
  ConsulterTypologieDuProjetQuery,
  ConsulterTypologieDuProjetReadModel,
} from './typologie-du-projet/consulter/consulterTypologieDuProjet.query';
import { ModifierTypologieDuProjetUseCase } from './typologie-du-projet/modifier/modifierTypologieDuProjet.usecase';

// Query
export type InstallationQuery =
  | ConsulterInstallationQuery
  | ConsulterTypologieDuProjetQuery
  | ListerHistoriqueInstallationProjetQuery;

export {
  ConsulterInstallationQuery,
  ConsulterInstallateurQuery,
  ConsulterTypologieDuProjetQuery,
  ListerHistoriqueInstallationProjetQuery,
};

// ReadModel
export {
  ConsulterInstallationReadModel,
  ConsulterInstallateurReadModel,
  HistoriqueInstallationProjetListItemReadModel,
  ConsulterTypologieDuProjetReadModel,
};

// UseCase
export type InstallationUseCase = ModifierInstallateurUseCase | ModifierTypologieDuProjetUseCase;
export { ModifierInstallateurUseCase } from './installateur/modifier/modifierInstallateur.usecase';
export { ModifierTypologieDuProjetUseCase } from './typologie-du-projet/modifier/modifierTypologieDuProjet.usecase';

// Event
export { InstallationEvent } from './installation.event';
export { InstallationImportéeEvent } from './importer/importerInstallation.event';
export { InstallateurModifiéEvent } from './installateur/modifier/modifierInstallateur.event';
export { TypologieDuProjetModifiéeEvent } from './typologie-du-projet/modifier/modifierTypologieDuProjet.event';

// Register
export { registerInstallationQueries, registerInstallationUseCases } from './installation.register';

// Entities
export * from './installation.entity';
