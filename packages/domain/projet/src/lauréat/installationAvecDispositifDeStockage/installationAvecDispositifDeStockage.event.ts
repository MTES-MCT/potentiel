import { InstallationAvecDispositifDeStockageImportéEvent } from './importer/importerInstallationAvecDispositifDeStockage.event';
import { InstallationAvecDispositifDeStockageModifiéEvent } from './modifier/modifierInstallationAvecDispositifDeStockage.event';

export type InstallationAvecDispositifDeStockageEvent =
  | InstallationAvecDispositifDeStockageImportéEvent
  | InstallationAvecDispositifDeStockageModifiéEvent;
