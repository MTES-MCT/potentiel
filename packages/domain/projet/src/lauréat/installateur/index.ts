import {
  ConsulterInstallateurQuery,
  ConsulterInstallateurReadModel,
} from './consulter/consulterInstallateur.query';
import { ModifierInstallateurUseCase } from './modifier/modifierInstallateur.usecase';

// Query
export type InstallateurQuery = ConsulterInstallateurQuery;

export { ConsulterInstallateurQuery };

// ReadModel
export { ConsulterInstallateurReadModel };

// UseCase
export type InstallateurUseCase = ModifierInstallateurUseCase;
export { ModifierInstallateurUseCase } from './modifier/modifierInstallateur.usecase';

// Event
export { InstallateurEvent } from './installateur.event';

export { InstallateurImportéEvent } from './importer/importerInstallateur.event';
export { InstallateurModifiéEvent } from './modifier/modifierInstallateur.event';

// Register
export { registerInstallateurQueries } from './installateur.register';

// Entities
export * from './installateur.entity';
