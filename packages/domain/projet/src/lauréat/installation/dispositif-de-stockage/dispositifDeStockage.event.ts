import { InstallationImportéeEvent } from '../importer/importerInstallation.event';

import { ChangementDispositifDeStockageEnregistréEvent } from './changement/enregistrer/enregistrerChangementDispositifDeStockage.event';
import { DispositifDeStockageModifiéEvent } from './modifier/modifierDispositifDeStockage.event';

export type DispositifDeStockageEvent =
  | InstallationImportéeEvent
  | DispositifDeStockageModifiéEvent
  | ChangementDispositifDeStockageEnregistréEvent;
