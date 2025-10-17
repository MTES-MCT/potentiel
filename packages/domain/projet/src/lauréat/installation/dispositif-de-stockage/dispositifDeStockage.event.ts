import { InstallationImportéeEvent } from '../importer/importerInstallation.event';

import { DispositifDeStockageModifiéEvent } from './modifier/modifierDispositifDeStockage.event';

export type DispositifDeStockageEvent =
  | InstallationImportéeEvent
  | DispositifDeStockageModifiéEvent;
