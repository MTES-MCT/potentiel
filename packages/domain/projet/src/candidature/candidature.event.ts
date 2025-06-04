import {
  CandidatureNotifiéeEvent,
  CandidatureNotifiéeEventV1,
} from './notifier/candidatureNotifiée.event';
import { CandidatureCorrigéeEvent } from './corriger/candidatureCorrigée.event';
import {
  CandidatureImportéeEvent,
  CandidatureImportéeEventV1,
  DétailsFournisseursCandidatureImportésEvent,
} from './importer/candidatureImportée.event';

export type CandidatureEvent =
  | CandidatureImportéeEvent
  | CandidatureImportéeEventV1
  | DétailsFournisseursCandidatureImportésEvent
  | CandidatureCorrigéeEvent
  | CandidatureNotifiéeEvent
  | CandidatureNotifiéeEventV1;
