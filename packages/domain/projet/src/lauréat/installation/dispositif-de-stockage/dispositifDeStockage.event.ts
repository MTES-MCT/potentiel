import { InstallationImportéeEvent } from '../importer/importerInstallation.event.js';

import { ChangementDispositifDeStockageEnregistréEvent } from './changement/enregistrer/enregistrerChangementDispositifDeStockage.event.js';
import { DispositifDeStockageModifiéEvent } from './modifier/modifierDispositifDeStockage.event.js';

export type DispositifDeStockageEvent =
  | InstallationImportéeEvent
  | DispositifDeStockageModifiéEvent
  | ChangementDispositifDeStockageEnregistréEvent;
