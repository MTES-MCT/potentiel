import { InstallationImportéeEvent } from '../importer/importerInstalltion.event';

import { InstallateurModifiéEvent } from './modifier/modifierInstallateur.event';

export type InstallateurEvent = InstallationImportéeEvent | InstallateurModifiéEvent;
