import { DélaiDemandéEvent } from './demande/demander/demanderDélai.event';
import { DélaiAccordéEvent } from './demande/accorder/accorderDemandeDélai.event';
import { DemandeDélaiAnnuléeEvent } from './demande/annuler/annulerDemandeDélai.event';

export type DélaiEvent = DélaiAccordéEvent | DélaiDemandéEvent | DemandeDélaiAnnuléeEvent;
