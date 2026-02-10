import {
  CandidatureNotifiéeEvent,
  CandidatureNotifiéeEventV1,
  CandidatureNotifiéeEventV2,
} from './notifier/candidatureNotifiée.event.js';
import {
  CandidatureCorrigéeEvent,
  CandidatureCorrigéeEventV1,
} from './corriger/candidatureCorrigée.event.js';
import {
  CandidatureImportéeEvent,
  CandidatureImportéeEventV1,
  DétailsFournisseursCandidatureImportésEvent,
} from './importer/candidatureImportée.event.js';
import { DétailCandidatureImportéEvent } from './détail/importer/détailCandidatureImporté.event.js';

export type CandidatureEvent =
  | DétailCandidatureImportéEvent
  | CandidatureImportéeEvent
  | CandidatureImportéeEventV1
  | DétailsFournisseursCandidatureImportésEvent
  | CandidatureCorrigéeEventV1
  | CandidatureCorrigéeEvent
  | CandidatureNotifiéeEvent
  | CandidatureNotifiéeEventV1
  | CandidatureNotifiéeEventV2;
