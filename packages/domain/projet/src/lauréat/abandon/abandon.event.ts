import type { AbandonAccordéEvent } from './demande/accorder/accorderAbandon.event.js';
import type { AbandonAnnuléEvent } from './demande/annuler/annulerAbandon.event.js';
import type { AbandonConfirméEvent } from './demande/confirmer/confirmerAbandon.event.js';
import type {
  AbandonDemandéEvent,
  AbandonDemandéEventV1,
} from './demande/demander/demanderAbandon.event.js';
import type { ConfirmationAbandonDemandéeEvent } from './demande/demanderConfirmation/demanderConfirmation.event.js';
import type { AbandonPasséEnInstructionEvent } from './demande/instruire/instruireAbandon.event.js';
import type { AbandonRejetéEvent } from './demande/rejeter/rejeterAbandon.event.js';
import type { PreuveRecandidatureDemandéeEvent } from './demanderPreuveRecandidature/demanderPreuveRecandidature.event.js';
import type { PreuveRecandidatureTransmiseEvent } from './transmettrePreuveRecandidature/transmettrePreuveRecandidature.event.js';

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
