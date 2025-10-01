import { DispositifDeStockageImportéEvent } from './importer/importerDispositifDeStockage.event';
import { DispositifDeStockageModifiéEvent } from './modifier/modifierDispositifDeStockage.event';

export type DispositifDeStockageEvent =
  | DispositifDeStockageImportéEvent
  | DispositifDeStockageModifiéEvent;
