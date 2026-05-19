import type { DispositifDeStockageEvent } from './dispositif-de-stockage/dispositifDeStockage.event.js';
import type { InstallateurEvent } from './installateur/installateur.event.js';
import type { TypologieInstallationEvent } from './typologie-installation/typologieInstallation.event.js';

export type InstallationEvent =
  | TypologieInstallationEvent
  | InstallateurEvent
  | DispositifDeStockageEvent;
