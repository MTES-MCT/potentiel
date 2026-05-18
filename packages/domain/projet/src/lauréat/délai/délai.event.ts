import type { DélaiAccordéEvent } from './accorder/accorderDélai.event.js';
import type { DemandeDélaiAnnuléeEvent } from './demande/annuler/annulerDemandeDélai.event.js';
import type { DemandeDélaiCorrigéeEvent } from './demande/corriger/corrigerDemandeDélai.event.js';
import type { DélaiDemandéEvent } from './demande/demander/demanderDélai.event.js';
import type { DemandeDélaiPasséeEnInstructionEvent } from './demande/passer-en-instruction/passerEnInstructionDemandeDélai.event.js';
import type { DemandeDélaiRejetéeEvent } from './demande/rejeter/rejeterDemandeDélai.event.js';
import type { DemandeDélaiSuppriméeEvent } from './demande/supprimer/supprimerDemandeDélai.event.js';

export type DélaiEvent =
  | DélaiAccordéEvent
  | DélaiDemandéEvent
  | DemandeDélaiAnnuléeEvent
  | DemandeDélaiPasséeEnInstructionEvent
  | DemandeDélaiRejetéeEvent
  | DemandeDélaiCorrigéeEvent
  | DemandeDélaiSuppriméeEvent;
