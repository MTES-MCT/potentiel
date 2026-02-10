import { InstallationImportéeEvent } from '../importer/importerInstallation.event.js';

import { ChangementInstallateurEnregistréEvent } from './changement/enregistrerChangement/enregistrerChangementInstallateur.event.js';
import { InstallateurModifiéEvent } from './modifier/modifierInstallateur.event.js';

export type InstallateurEvent =
  | InstallationImportéeEvent
  | InstallateurModifiéEvent
  | ChangementInstallateurEnregistréEvent;
