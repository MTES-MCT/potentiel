import type { AbandonAccordéEvent } from './accorder/accorderAbandon.event';
import type { AbandonAnnuléEvent } from './annuler/annulerAbandon.event';
import type { AbandonConfirméEvent } from './confirmer/confirmerAbandon.event';
import type { AbandonDemandéEvent, AbandonDemandéEventV1 } from './demander/demanderAbandon.event';
import type { ConfirmationAbandonDemandéeEvent } from './demanderConfirmation/demanderConfirmation.event';
import type { PreuveRecandidatureDemandéeEvent } from './demanderPreuveRecandidature/demanderPreuveRecandidature.event';
import type { AbandonPasséEnInstructionEvent } from './instruire/instruireAbandon.event';
import type { AbandonRejetéEvent } from './rejeter/rejeterAbandon.event';
import type { PreuveRecandidatureTransmiseEvent } from './transmettrePreuveRecandidature/transmettrePreuveRecandidature.event';

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
