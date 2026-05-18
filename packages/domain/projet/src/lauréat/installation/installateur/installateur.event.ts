import type { InstallationImportéeEvent } from '../importer/importerInstallation.event.js';
import type { ChangementInstallateurEnregistréEvent } from './changement/enregistrerChangement/enregistrerChangementInstallateur.event.js';
import type { InstallateurModifiéEvent } from './modifier/modifierInstallateur.event.js';

export type InstallateurEvent =
  | InstallationImportéeEvent
  | InstallateurModifiéEvent
  | ChangementInstallateurEnregistréEvent;
