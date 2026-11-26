import type { ImportPériodeInitiéEvent } from './importer/importPériodeInitié.event.js';
import type { PériodeImportéeEvent } from './importer/périodeImportée.event.js';
import type { PériodeNotifiéeEvent } from './période.js';

export type PériodeEvent = PériodeNotifiéeEvent | ImportPériodeInitiéEvent | PériodeImportéeEvent;
