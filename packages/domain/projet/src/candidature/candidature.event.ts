import {
  CandidatureNotifiéeEvent,
  CandidatureNotifiéeEventV1,
  CandidatureNotifiéeEventV2,
} from './notifier/candidatureNotifiée.event';
import {
  CandidatureCorrigéeEvent,
  CandidatureCorrigéeEventV1,
} from './corriger/candidatureCorrigée.event';
import {
  CandidatureImportéeEvent,
  CandidatureImportéeEventV1,
  DétailsFournisseursCandidatureImportésEvent,
} from './importer/candidatureImportée.event';
import { DétailCandidatureImportéEvent } from './détail/importer/détailCandidatureImporté.event';
import { DétailCandidatureCorrigéEvent } from './détail/corriger/détailCandidatureCorrigé.event';

export type CandidatureEvent =
  | DétailCandidatureImportéEvent
  | DétailCandidatureCorrigéEvent
  | CandidatureImportéeEvent
  | CandidatureImportéeEventV1
  | DétailsFournisseursCandidatureImportésEvent
  | CandidatureCorrigéeEventV1
  | CandidatureCorrigéeEvent
  | CandidatureNotifiéeEvent
  | CandidatureNotifiéeEventV1
  | CandidatureNotifiéeEventV2;
