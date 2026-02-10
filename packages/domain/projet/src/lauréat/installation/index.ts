import {
  ConsulterInstallationQuery,
  ConsulterInstallationReadModel,
} from './consulter/consulterInstallation.query.js';
import {
  ConsulterChangementDispositifDeStockageQuery,
  ConsulterChangementDispositifDeStockageReadModel,
} from './dispositif-de-stockage/changement/consulter/consulterChangementDispositifDeStockage.query.js';
import { EnregistrerChangementDispositifDeStockageUseCase } from './dispositif-de-stockage/changement/enregistrer/enregistrerChangementDispositifDeStockage.usecase.js';
import {
  ListerChangementDispositifDeStockageQuery,
  ListerChangementDispositifDeStockageReadModel,
} from './dispositif-de-stockage/changement/lister/listerChangementDispositifDeStockage.query.js';
import {
  ConsulterDispositifDeStockageQuery,
  ConsulterDispositifDeStockageReadModel,
} from './dispositif-de-stockage/consulter/consulterDispositifDeStockage.query.js';
import { ModifierDispositifDeStockageUseCase } from './dispositif-de-stockage/modifier/modifierDispositifDeStockage.usecase.js';
import {
  ConsulterChangementInstallateurQuery,
  ConsulterChangementInstallateurReadModel,
} from './installateur/changement/consulter/consulterChangementInstallateur.query.js';
import { EnregistrerChangementInstallateurUseCase } from './installateur/changement/enregistrerChangement/enregistrerChangementInstallateur.usecase.js';
import {
  ListerChangementInstallateurQuery,
  ListerChangementInstallateurReadModel,
} from './installateur/changement/lister/listerChangementInstallateur.query.js';
import {
  ConsulterInstallateurQuery,
  ConsulterInstallateurReadModel,
} from './installateur/consulter/consulterInstallateur.query.js';
import { ModifierInstallateurUseCase } from './installateur/modifier/modifierInstallateur.usecase.js';
import {
  HistoriqueInstallationProjetListItemReadModel,
  ListerHistoriqueInstallationProjetQuery,
} from './listerHistorique/listerHistoriqueInstallationProjet.query.js';
import {
  ConsulterTypologieInstallationQuery,
  ConsulterTypologieInstallationReadModel,
} from './typologie-installation/consulter/consulterTypologieInstallation.query.js';
import { ModifierTypologieInstallationUseCase } from './typologie-installation/modifier/modifierTypologieInstallation.usecase.js';

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

export type {
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
export type {
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

export type { ModifierInstallateurUseCase } from './installateur/modifier/modifierInstallateur.usecase.js';
export type { ModifierTypologieInstallationUseCase } from './typologie-installation/modifier/modifierTypologieInstallation.usecase.js';
export type { ModifierDispositifDeStockageUseCase } from './dispositif-de-stockage/modifier/modifierDispositifDeStockage.usecase.js';
export type { EnregistrerChangementInstallateurUseCase } from './installateur/changement/enregistrerChangement/enregistrerChangementInstallateur.usecase.js';
export type { EnregistrerChangementDispositifDeStockageUseCase } from './dispositif-de-stockage/changement/enregistrer/enregistrerChangementDispositifDeStockage.usecase.js';

// Event
export type { InstallationEvent } from './installation.event.js';
export type { InstallateurEvent } from './installateur/installateur.event.js';
export type { InstallationImportéeEvent } from './importer/importerInstallation.event.js';
export type { InstallateurModifiéEvent } from './installateur/modifier/modifierInstallateur.event.js';
export type { TypologieInstallationModifiéeEvent } from './typologie-installation/modifier/modifierTypologieInstallation.event.js';
export type { DispositifDeStockageModifiéEvent } from './dispositif-de-stockage/modifier/modifierDispositifDeStockage.event.js';
export type { ChangementInstallateurEnregistréEvent } from './installateur/changement/enregistrerChangement/enregistrerChangementInstallateur.event.js';
export type { ChangementDispositifDeStockageEnregistréEvent } from './dispositif-de-stockage/changement/enregistrer/enregistrerChangementDispositifDeStockage.event.js';

// Register
export {
  registerInstallationQueries,
  registerInstallationUseCases,
} from './installation.register.js';

// Entities
export type * from './installation.entity.js';
export type * from './installateur/changement/changementInstallateur.entity.js';
export type * from './dispositif-de-stockage/changement/changementDispositifDeStockage.entity.js';

// Value type
export * as DispositifDeStockage from './dispositif-de-stockage/dispositifDeStockage.valueType.js';
export * as TypeDocumentInstallateur from './installateur/typeDocumentInstallateur.valueType.js';
export * as TypeDocumentDispositifDeStockage from './dispositif-de-stockage/typeDocumentDispositifDeStockage.valueType.js';
export * as TypeDocumentTypologieInstallation from './typologie-installation/typeDocumentTypologieInstallation.valueType.js';
