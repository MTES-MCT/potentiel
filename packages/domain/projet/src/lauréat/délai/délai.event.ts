import { DélaiDemandéEvent } from './demande/demander/demanderDélai.event';
import { DélaiAccordéEvent } from './accorder/accorderDélai.event';
import { DemandeDélaiAnnuléeEvent } from './demande/annuler/annulerDemandeDélai.event';
import { DemandeDélaiRejetéeEvent } from './demande/rejeter/rejeterDemandeDélai.event';
import { DemandeDélaiPasséeEnInstructionEvent } from './demande/passer-en-instruction/passerEnInstructionDemandeDélai.event';
import { DemandeDélaiCorrigéeEvent } from './demande/corriger/corrigerDemandeDélai.event';
import { DemandeDélaiSuppriméeEvent } from './demande/supprimer/supprimerDemandeDélai.event';

export type DélaiEvent =
  | DélaiAccordéEvent
  | DélaiDemandéEvent
  | DemandeDélaiAnnuléeEvent
  | DemandeDélaiPasséeEnInstructionEvent
  | DemandeDélaiRejetéeEvent
  | DemandeDélaiCorrigéeEvent
  | DemandeDélaiSuppriméeEvent;
