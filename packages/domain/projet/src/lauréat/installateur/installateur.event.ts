import { InstallateurImportéEvent } from './importer/importerInstallateur.event';
import { InstallateurModifiéEvent } from './modifier/modifierInstallateur.event';

export type InstallateurEvent = InstallateurImportéEvent | InstallateurModifiéEvent;
