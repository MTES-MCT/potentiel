import type {
  ConsulterInstallationQuery,
  ConsulterInstallationReadModel,
} from './consulter/consulterInstallation.query.js';
import type {
  ConsulterChangementDispositifDeStockageQuery,
  ConsulterChangementDispositifDeStockageReadModel,
} from './dispositif-de-stockage/changement/consulter/consulterChangementDispositifDeStockage.query.js';
import type { EnregistrerChangementDispositifDeStockageUseCase } from './dispositif-de-stockage/changement/enregistrer/enregistrerChangementDispositifDeStockage.usecase.js';
import type {
  ListerChangementDispositifDeStockageQuery,
  ListerChangementDispositifDeStockageReadModel,
} from './dispositif-de-stockage/changement/lister/listerChangementDispositifDeStockage.query.js';
import type {
  ConsulterDispositifDeStockageQuery,
  ConsulterDispositifDeStockageReadModel,
} from './dispositif-de-stockage/consulter/consulterDispositifDeStockage.query.js';
import type { ModifierDispositifDeStockageUseCase } from './dispositif-de-stockage/modifier/modifierDispositifDeStockage.usecase.js';
import type {
  ConsulterChangementInstallateurQuery,
  ConsulterChangementInstallateurReadModel,
} from './installateur/changement/consulter/consulterChangementInstallateur.query.js';
import type { EnregistrerChangementInstallateurUseCase } from './installateur/changement/enregistrerChangement/enregistrerChangementInstallateur.usecase.js';
import type {
  ListerChangementInstallateurQuery,
  ListerChangementInstallateurReadModel,
} from './installateur/changement/lister/listerChangementInstallateur.query.js';
import type {
  ConsulterInstallateurQuery,
  ConsulterInstallateurReadModel,
} from './installateur/consulter/consulterInstallateur.query.js';
import type { ModifierInstallateurUseCase } from './installateur/modifier/modifierInstallateur.usecase.js';
import type {
  HistoriqueInstallationProjetListItemReadModel,
  ListerHistoriqueInstallationProjetQuery,
} from './listerHistorique/listerHistoriqueInstallationProjet.query.js';
import type {
  ConsulterTypologieInstallationQuery,
  ConsulterTypologieInstallationReadModel,
} from './typologie-installation/consulter/consulterTypologieInstallation.query.js';
import type { ModifierTypologieInstallationUseCase } from './typologie-installation/modifier/modifierTypologieInstallation.usecase.js';

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

// ReadModel
export type {
  ConsulterChangementDispositifDeStockageQuery,
  ConsulterChangementDispositifDeStockageReadModel,
  ConsulterChangementInstallateurQuery,
  ConsulterChangementInstallateurReadModel,
  ConsulterDispositifDeStockageQuery,
  ConsulterDispositifDeStockageReadModel,
  ConsulterInstallateurQuery,
  ConsulterInstallateurReadModel,
  ConsulterInstallationQuery,
  ConsulterInstallationReadModel,
  ConsulterTypologieInstallationQuery,
  ConsulterTypologieInstallationReadModel,
  HistoriqueInstallationProjetListItemReadModel,
  ListerChangementDispositifDeStockageQuery,
  ListerChangementDispositifDeStockageReadModel,
  ListerChangementInstallateurQuery,
  ListerChangementInstallateurReadModel,
  ListerHistoriqueInstallationProjetQuery,
};

// UseCase
export type InstallationUseCase =
  | ModifierInstallateurUseCase
  | ModifierTypologieInstallationUseCase
  | ModifierDispositifDeStockageUseCase
  | EnregistrerChangementInstallateurUseCase
  | EnregistrerChangementDispositifDeStockageUseCase;

export type * from './dispositif-de-stockage/changement/changementDispositifDeStockage.entity.js';
export type { ChangementDispositifDeStockageEnregistréEvent } from './dispositif-de-stockage/changement/enregistrer/enregistrerChangementDispositifDeStockage.event.js';
export type { EnregistrerChangementDispositifDeStockageUseCase } from './dispositif-de-stockage/changement/enregistrer/enregistrerChangementDispositifDeStockage.usecase.js';
// Value type
export * as DispositifDeStockage from './dispositif-de-stockage/dispositifDeStockage.valueType.js';
export * as DocumentDispositifDeStockage from './dispositif-de-stockage/documentDispositifDeStockage.valueType.js';
export type { DispositifDeStockageModifiéEvent } from './dispositif-de-stockage/modifier/modifierDispositifDeStockage.event.js';
export type { ModifierDispositifDeStockageUseCase } from './dispositif-de-stockage/modifier/modifierDispositifDeStockage.usecase.js';
export type { InstallationImportéeEvent } from './importer/importerInstallation.event.js';
export type * from './installateur/changement/changementInstallateur.entity.js';
export type { ChangementInstallateurEnregistréEvent } from './installateur/changement/enregistrerChangement/enregistrerChangementInstallateur.event.js';
export type { EnregistrerChangementInstallateurUseCase } from './installateur/changement/enregistrerChangement/enregistrerChangementInstallateur.usecase.js';
export * as DocumentInstallateur from './installateur/documentInstallateur.valueType.js';
export type { InstallateurEvent } from './installateur/installateur.event.js';
export type { InstallateurModifiéEvent } from './installateur/modifier/modifierInstallateur.event.js';
export type { ModifierInstallateurUseCase } from './installateur/modifier/modifierInstallateur.usecase.js';
// Entities
export type * from './installation.entity.js';
// Event
export type { InstallationEvent } from './installation.event.js';
// Register
export {
  registerInstallationQueries,
  registerInstallationUseCases,
} from './installation.register.js';
export * as DocumentTypologieInstallation from './typologie-installation/documentTypologieInstallation.valueType.js';
export type { TypologieInstallationModifiéeEvent } from './typologie-installation/modifier/modifierTypologieInstallation.event.js';
export type { ModifierTypologieInstallationUseCase } from './typologie-installation/modifier/modifierTypologieInstallation.usecase.js';
