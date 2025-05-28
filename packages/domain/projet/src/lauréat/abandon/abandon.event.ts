import { AbandonAccordéEvent } from './accorder/accorderAbandon.event';
import { AbandonAnnuléEvent } from './annuler/annulerAbandon.event';
import { AbandonDemandéEvent, AbandonDemandéEventV1 } from './demander/demanderAbandon.event';
import { PreuveRecandidatureDemandéeEvent } from './demanderPreuveRecandidature/demanderPreuveRecandidature.event';
import { AbandonPasséEnInstructionEvent } from './instruire/instruireAbandon.event';
import { AbandonRejetéEvent } from './rejeter/rejeterAbandon.event';
import { PreuveRecandidatureTransmiseEvent } from './transmettrePreuveRecandidature/transmettrePreuveRecandidature.event';

export type AbandonEvent =
  | AbandonDemandéEventV1
  | AbandonDemandéEvent
  | AbandonAccordéEvent
  | AbandonRejetéEvent
  | AbandonAnnuléEvent
  | AbandonPasséEnInstructionEvent
  | PreuveRecandidatureDemandéeEvent
  | PreuveRecandidatureTransmiseEvent;
