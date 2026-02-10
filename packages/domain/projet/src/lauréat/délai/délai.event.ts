import { DélaiDemandéEvent } from './demande/demander/demanderDélai.event.js';
import { DélaiAccordéEvent } from './accorder/accorderDélai.event.js';
import { DemandeDélaiAnnuléeEvent } from './demande/annuler/annulerDemandeDélai.event.js';
import { DemandeDélaiRejetéeEvent } from './demande/rejeter/rejeterDemandeDélai.event.js';
import { DemandeDélaiPasséeEnInstructionEvent } from './demande/passer-en-instruction/passerEnInstructionDemandeDélai.event.js';
import { DemandeDélaiCorrigéeEvent } from './demande/corriger/corrigerDemandeDélai.event.js';
import { DemandeDélaiSuppriméeEvent } from './demande/supprimer/supprimerDemandeDélai.event.js';

export type DélaiEvent =
  | DélaiAccordéEvent
  | DélaiDemandéEvent
  | DemandeDélaiAnnuléeEvent
  | DemandeDélaiPasséeEnInstructionEvent
  | DemandeDélaiRejetéeEvent
  | DemandeDélaiCorrigéeEvent
  | DemandeDélaiSuppriméeEvent;
