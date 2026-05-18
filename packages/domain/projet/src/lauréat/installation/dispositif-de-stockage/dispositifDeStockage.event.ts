import type { InstallationImportéeEvent } from '../importer/importerInstallation.event.js';
import type { ChangementDispositifDeStockageEnregistréEvent } from './changement/enregistrer/enregistrerChangementDispositifDeStockage.event.js';
import type { DispositifDeStockageModifiéEvent } from './modifier/modifierDispositifDeStockage.event.js';

export type DispositifDeStockageEvent =
  | InstallationImportéeEvent
  | DispositifDeStockageModifiéEvent
  | ChangementDispositifDeStockageEnregistréEvent;
