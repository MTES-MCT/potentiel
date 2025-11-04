import { InstallationImportéeEvent } from '../importer/importerInstallation.event';

import { ChangementInstallateurEnregistréEvent } from './changement/enregistrerChangement/enregistrerChangementInstallateur.event';
import { InstallateurModifiéEvent } from './modifier/modifierInstallateur.event';

export type InstallateurEvent =
  | InstallationImportéeEvent
  | InstallateurModifiéEvent
  | ChangementInstallateurEnregistréEvent;
