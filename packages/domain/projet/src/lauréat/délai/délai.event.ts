import { DélaiDemandéEvent } from './demande/demander/demanderDélai.event';
import { DélaiAccordéEvent } from './demande/accorder/accorderDemandeDélai.event';

export type DélaiEvent = DélaiAccordéEvent | DélaiDemandéEvent;
