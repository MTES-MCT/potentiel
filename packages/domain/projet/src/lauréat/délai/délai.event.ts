import type { DélaiAccordéEvent } from './accorder/accorderDélai.event';
import type { DemandeDélaiAnnuléeEvent } from './demande/annuler/annulerDemandeDélai.event';
import type { DemandeDélaiCorrigéeEvent } from './demande/corriger/corrigerDemandeDélai.event';
import type { DélaiDemandéEvent } from './demande/demander/demanderDélai.event';
import type { DemandeDélaiPasséeEnInstructionEvent } from './demande/passer-en-instruction/passerEnInstructionDemandeDélai.event';
import type { DemandeDélaiRejetéeEvent } from './demande/rejeter/rejeterDemandeDélai.event';
import type { DemandeDélaiSuppriméeEvent } from './demande/supprimer/supprimerDemandeDélai.event';

export type DélaiEvent =
  | DélaiAccordéEvent
  | DélaiDemandéEvent
  | DemandeDélaiAnnuléeEvent
  | DemandeDélaiPasséeEnInstructionEvent
  | DemandeDélaiRejetéeEvent
  | DemandeDélaiCorrigéeEvent
  | DemandeDélaiSuppriméeEvent;
