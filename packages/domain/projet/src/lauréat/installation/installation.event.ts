import { InstallateurEvent } from './installateur/installateur.event';
import { TypologieDuProjetEvent } from './typologie-du-projet/typologieDuProjet.event';

export type InstallationEvent = TypologieDuProjetEvent | InstallateurEvent;
