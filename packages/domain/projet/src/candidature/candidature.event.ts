import { CandidatureCorrigéeEvent } from './corriger/candidatureCorrigée.event';
import { CandidatureImportéeEvent } from './importer/candidatureImportée.event';

export type CandidatureEvent = CandidatureImportéeEvent | CandidatureCorrigéeEvent;
