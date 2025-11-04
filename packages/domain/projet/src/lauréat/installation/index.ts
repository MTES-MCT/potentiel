import {
  ConsulterInstallationQuery,
  ConsulterInstallationReadModel,
} from './consulter/consulterInstallation.query';
import {
  ConsulterDispositifDeStockageQuery,
  ConsulterDispositifDeStockageReadModel,
} from './dispositif-de-stockage/consulter/consulterDispositifDeStockage.query';
import { ModifierDispositifDeStockageUseCase } from './dispositif-de-stockage/modifier/modifierDispositifDeStockage.usecase';
import {
  ConsulterChangementInstallateurQuery,
  ConsulterChangementInstallateurReadModel,
} from './installateur/changement/consulter/consulterChangementInstallateur.query';
import { EnregistrerChangementInstallateurUseCase } from './installateur/changement/enregistrerChangement/enregistrerChangementInstallateur.usecase';
import {
  ListerChangementInstallateurQuery,
  ListerChangementInstallateurReadModel,
} from './installateur/changement/lister/listerChangementInstallateur.query';
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
  | ListerHistoriqueInstallationProjetQuery
  | ListerHistoriqueInstallationProjetQuery
  | ConsulterDispositifDeStockageQuery
  | ConsulterChangementInstallateurQuery
  | ListerChangementInstallateurQuery;

export {
  ConsulterInstallationQuery,
  ConsulterInstallateurQuery,
  ConsulterTypologieInstallationQuery,
  ListerHistoriqueInstallationProjetQuery,
  ConsulterDispositifDeStockageQuery,
  ConsulterChangementInstallateurQuery,
  ListerChangementInstallateurQuery,
};

// ReadModel
export {
  ConsulterInstallationReadModel,
  ConsulterInstallateurReadModel,
  HistoriqueInstallationProjetListItemReadModel,
  ConsulterTypologieInstallationReadModel,
  ConsulterDispositifDeStockageReadModel,
  ConsulterChangementInstallateurReadModel,
  ListerChangementInstallateurReadModel,
};

// UseCase
export type InstallationUseCase =
  | ModifierInstallateurUseCase
  | ModifierTypologieInstallationUseCase
  | ModifierDispositifDeStockageUseCase
  | EnregistrerChangementInstallateurUseCase;

export { ModifierInstallateurUseCase } from './installateur/modifier/modifierInstallateur.usecase';
export { ModifierTypologieInstallationUseCase } from './typologie-installation/modifier/modifierTypologieInstallation.usecase';
export { ModifierDispositifDeStockageUseCase } from './dispositif-de-stockage/modifier/modifierDispositifDeStockage.usecase';
export { EnregistrerChangementInstallateurUseCase } from './installateur/changement/enregistrerChangement/enregistrerChangementInstallateur.usecase';

// Event
export { InstallationEvent } from './installation.event';
export { InstallationImportéeEvent } from './importer/importerInstallation.event';
export { InstallateurModifiéEvent } from './installateur/modifier/modifierInstallateur.event';
export { TypologieInstallationModifiéeEvent } from './typologie-installation/modifier/modifierTypologieInstallation.event';
export { DispositifDeStockageModifiéEvent } from './dispositif-de-stockage/modifier/modifierDispositifDeStockage.event';
export { ChangementInstallateurEnregistréEvent } from './installateur/changement/enregistrerChangement/enregistrerChangementInstallateur.event';

// Register
export { registerInstallationQueries, registerInstallationUseCases } from './installation.register';

// Entities
export * from './installation.entity';
export * from './installateur/changement/changementInstallateur.entity';

// Value type
export * as DispositifDeStockage from './dispositif-de-stockage/dispositifDeStockage.valueType';
export * as TypeDocumentInstallateur from './installateur/typeDocumentInstallateur.valueType';
