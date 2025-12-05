import { AbandonAccordéEvent } from './demande/accorder/accorderAbandon.event';
import { AbandonAnnuléEvent } from './demande/annuler/annulerAbandon.event';
import { AbandonConfirméEvent } from './demande/confirmer/confirmerAbandon.event';
import {
  AbandonDemandéEventV1,
  AbandonDemandéEvent,
} from './demande/demander/demanderAbandon.event';
import { ConfirmationAbandonDemandéeEvent } from './demande/demanderConfirmation/demanderConfirmation.event';
import { AbandonPasséEnInstructionEvent } from './demande/instruire/instruireAbandon.event';
import { AbandonRejetéEvent } from './demande/rejeter/rejeterAbandon.event';
import { PreuveRecandidatureDemandéeEvent } from './demanderPreuveRecandidature/demanderPreuveRecandidature.event';
import { PreuveRecandidatureTransmiseEvent } from './transmettrePreuveRecandidature/transmettrePreuveRecandidature.event';

export type AbandonEvent =
  | AbandonDemandéEventV1
  | AbandonDemandéEvent
  | AbandonAccordéEvent
  | AbandonRejetéEvent
  | AbandonAnnuléEvent
  | AbandonPasséEnInstructionEvent
  | PreuveRecandidatureDemandéeEvent
  | PreuveRecandidatureTransmiseEvent
  | ConfirmationAbandonDemandéeEvent
  | AbandonConfirméEvent;
