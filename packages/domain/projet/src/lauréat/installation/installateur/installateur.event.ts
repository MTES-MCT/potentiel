import { InstallationImportéeEvent } from '../importer/importerInstallation.event';

import { InstallateurModifiéEvent } from './modifier/modifierInstallateur.event';

export type InstallateurEvent = InstallationImportéeEvent | InstallateurModifiéEvent;
