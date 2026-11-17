import type { ImportPériodeInitiéEvent } from './importer/initierImportPériode.event.js';
import type { PériodeNotifiéeEvent } from './période.js';

export type PériodeEvent = PériodeNotifiéeEvent | ImportPériodeInitiéEvent;
