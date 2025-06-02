import {
  CandidatureNotifiéeEvent,
  CandidatureNotifiéeEventV1,
} from './notifier/candidatureNotifiée.event';
import { CandidatureCorrigéeEvent } from './corriger/candidatureCorrigée.event';
import {
  CandidatureImportéeEvent,
  CandidatureImportéeEventV1,
  FournisseursCandidatureImportésEvent,
} from './importer/candidatureImportée.event';

export type CandidatureEvent =
  | CandidatureImportéeEvent
  | CandidatureImportéeEventV1
  | FournisseursCandidatureImportésEvent
  | CandidatureCorrigéeEvent
  | CandidatureNotifiéeEvent
  | CandidatureNotifiéeEventV1;
