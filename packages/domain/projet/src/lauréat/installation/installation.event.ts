import { DispositifDeStockageEvent } from './dispositif-de-stockage/dispositifDeStockage.event';
import { InstallateurEvent } from './installateur/installateur.event';
import { TypologieInstallationEvent } from './typologie-installation/typologieInstallation.event';

export type InstallationEvent =
  | TypologieInstallationEvent
  | InstallateurEvent
  | DispositifDeStockageEvent;
