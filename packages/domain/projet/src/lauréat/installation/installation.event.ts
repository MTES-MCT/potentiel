import { InstallateurModifiéEvent } from '.';

import { InstallationImportéeEvent } from './importer/importerInstalltion.event';

export type InstallationEvent = InstallateurModifiéEvent | InstallationImportéeEvent;
