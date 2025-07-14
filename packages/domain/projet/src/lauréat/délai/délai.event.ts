import { DélaiDemandéEvent } from './demande/demander/demanderDélai.event';
import { DélaiAccordéEvent } from './demande/accorder/accorderDemandeDélai.event';
import { DemandeDélaiAnnuléeEvent } from './demande/annuler/annulerDemandeDélai.event';
import { DemandeDélaiRejetéeEvent } from './demande/rejeter/rejeterDemandeDélai.event';
import { DemandeDélaiPasséeEnInstructionEvent } from './demande/passer-en-instruction/passerEnInstructionDemandeDélai.event';

export type DélaiEvent =
  | DélaiAccordéEvent
  | DélaiDemandéEvent
  | DemandeDélaiAnnuléeEvent
  | DemandeDélaiPasséeEnInstructionEvent
  | DemandeDélaiRejetéeEvent;
