import { DispositifDeStockageEvent } from './dispositif-de-stockage/dispositifDeStockage.event.js';
import { InstallateurEvent } from './installateur/installateur.event.js';
import { TypologieInstallationEvent } from './typologie-installation/typologieInstallation.event.js';

export type InstallationEvent =
  | TypologieInstallationEvent
  | InstallateurEvent
  | DispositifDeStockageEvent;
