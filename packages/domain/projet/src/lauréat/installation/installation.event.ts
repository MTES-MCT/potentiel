import { InstallateurEvent } from './installateur/installateur.event';
import { TypologieInstallationEvent } from './typologie-installation/typologieInstallation.event';

export type InstallationEvent = TypologieInstallationEvent | InstallateurEvent;
