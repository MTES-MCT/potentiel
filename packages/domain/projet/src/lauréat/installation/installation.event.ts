import { InstallateurModifiéEvent } from '.';

import { InstallationImportéeEvent } from './importer/importerInstallation.event';

export type InstallationEvent = InstallateurModifiéEvent | InstallationImportéeEvent;
