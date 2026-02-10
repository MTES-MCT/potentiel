import { AbandonAccordéEvent } from './demande/accorder/accorderAbandon.event.js';
import { AbandonAnnuléEvent } from './demande/annuler/annulerAbandon.event.js';
import { AbandonConfirméEvent } from './demande/confirmer/confirmerAbandon.event.js';
import {
  AbandonDemandéEventV1,
  AbandonDemandéEvent,
} from './demande/demander/demanderAbandon.event.js';
import { ConfirmationAbandonDemandéeEvent } from './demande/demanderConfirmation/demanderConfirmation.event.js';
import { AbandonPasséEnInstructionEvent } from './demande/instruire/instruireAbandon.event.js';
import { AbandonRejetéEvent } from './demande/rejeter/rejeterAbandon.event.js';
import { PreuveRecandidatureDemandéeEvent } from './demanderPreuveRecandidature/demanderPreuveRecandidature.event.js';
import { PreuveRecandidatureTransmiseEvent } from './transmettrePreuveRecandidature/transmettrePreuveRecandidature.event.js';

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
