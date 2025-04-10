import {
  CandidatureNotifiéeEvent,
  CandidatureNotifiéeEventV1,
} from './notifier/candidatureNotifiée.event';
import { CandidatureCorrigéeEvent } from './corriger/candidatureCorrigée.event';
import { CandidatureImportéeEvent } from './importer/candidatureImportée.event';

export type CandidatureEvent =
  | CandidatureImportéeEvent
  | CandidatureCorrigéeEvent
  | CandidatureNotifiéeEvent
  | CandidatureNotifiéeEventV1;
