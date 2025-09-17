import { InstallationAvecDispositifDeStockageImportéeEvent } from './importer/importerInstallationAvecDispositifDeStockage.event';
import { InstallationAvecDispositifDeStockageModifiéeEvent } from './modifier/modifierInstallationAvecDispositifDeStockage.event';

export type InstallationAvecDispositifDeStockageEvent =
  | InstallationAvecDispositifDeStockageImportéeEvent
  | InstallationAvecDispositifDeStockageModifiéeEvent;
