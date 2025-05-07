import { AbandonAccordéEvent } from './accorder/accorderAbandon.event';
import { AbandonAnnuléEvent } from './annuler/annulerAbandon.event';
import { AbandonDemandéEvent, AbandonDemandéEventV1 } from './demander/demanderAbandon.event';
import { AbandonRejetéEvent } from './rejeter/rejeterAbandon.event';

export type AbandonEvent =
  | AbandonDemandéEventV1
  | AbandonDemandéEvent
  | AbandonAccordéEvent
  | AbandonRejetéEvent
  | AbandonAnnuléEvent;
