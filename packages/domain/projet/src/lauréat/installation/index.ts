import {
  ConsulterInstallationQuery,
  ConsulterInstallationReadModel,
} from './consulter/consulterInstallation.query';
import {
  ConsulterChangementDispositifDeStockageQuery,
  ConsulterChangementDispositifDeStockageReadModel,
} from './dispositif-de-stockage/changement/consulter/consulterChangementDispositifDeStockage.query';
import { EnregistrerChangementDispositifDeStockageUseCase } from './dispositif-de-stockage/changement/enregistrer/enregistrerChangementDispositifDeStockage.usecase';
import {
  ListerChangementDispositifDeStockageQuery,
  ListerChangementDispositifDeStockageReadModel,
} from './dispositif-de-stockage/changement/lister/listerChangementDispositifDeStockagequery';
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
  | ListerChangementInstallateurQuery
  | ConsulterChangementDispositifDeStockageQuery
  | ListerChangementDispositifDeStockageQuery;

export {
  ConsulterInstallationQuery,
  ConsulterInstallateurQuery,
  ConsulterTypologieInstallationQuery,
  ListerHistoriqueInstallationProjetQuery,
  ConsulterDispositifDeStockageQuery,
  ConsulterChangementInstallateurQuery,
  ListerChangementInstallateurQuery,
  ConsulterChangementDispositifDeStockageQuery,
  ListerChangementDispositifDeStockageQuery,
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
  ConsulterChangementDispositifDeStockageReadModel,
  ListerChangementDispositifDeStockageReadModel,
};

// UseCase
export type InstallationUseCase =
  | ModifierInstallateurUseCase
  | ModifierTypologieInstallationUseCase
  | ModifierDispositifDeStockageUseCase
  | EnregistrerChangementInstallateurUseCase
  | EnregistrerChangementDispositifDeStockageUseCase;

export { ModifierInstallateurUseCase } from './installateur/modifier/modifierInstallateur.usecase';
export { ModifierTypologieInstallationUseCase } from './typologie-installation/modifier/modifierTypologieInstallation.usecase';
export { ModifierDispositifDeStockageUseCase } from './dispositif-de-stockage/modifier/modifierDispositifDeStockage.usecase';
export { EnregistrerChangementInstallateurUseCase } from './installateur/changement/enregistrerChangement/enregistrerChangementInstallateur.usecase';
export { EnregistrerChangementDispositifDeStockageUseCase } from './dispositif-de-stockage/changement/enregistrer/enregistrerChangementDispositifDeStockage.usecase';

// Event
export { InstallationEvent } from './installation.event';
export { InstallateurEvent } from './installateur/installateur.event';
export { InstallationImportéeEvent } from './importer/importerInstallation.event';
export { InstallateurModifiéEvent } from './installateur/modifier/modifierInstallateur.event';
export { TypologieInstallationModifiéeEvent } from './typologie-installation/modifier/modifierTypologieInstallation.event';
export { DispositifDeStockageModifiéEvent } from './dispositif-de-stockage/modifier/modifierDispositifDeStockage.event';
export { ChangementInstallateurEnregistréEvent } from './installateur/changement/enregistrerChangement/enregistrerChangementInstallateur.event';
export { ChangementDispositifDeStockageEnregistréEvent } from './dispositif-de-stockage/changement/enregistrer/enregistrerChangementDispositifDeStockage.event';

// Register
export { registerInstallationQueries, registerInstallationUseCases } from './installation.register';

// Entities
export * from './installation.entity';
export * from './installateur/changement/changementInstallateur.entity';
export * from './dispositif-de-stockage/changement/changementDispositifDeStockage.entity';

// Value type
export * as DispositifDeStockage from './dispositif-de-stockage/dispositifDeStockage.valueType';
export * as TypeDocumentInstallateur from './installateur/typeDocumentInstallateur.valueType';
export * as TypeDocumentDispositifDeStockage from './dispositif-de-stockage/typeDocumentIDispositifDeStockage.valueType';
