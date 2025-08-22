import type { RecoursAccordéEvent } from './accorder/recoursAccordé.event';
import type { RecoursAnnuléEvent } from './annuler/annulerRecours.event';
import type { RecoursDemandéEvent } from './demander/demanderRecours.event';
import type { RecoursPasséEnInstructionEvent } from './instruire/passerRecoursEnInstruction.event';
import type { RecoursRejetéEvent } from './rejeter/rejeterRecours.event';

export type RecoursEvent =
  | RecoursAccordéEvent
  | RecoursAnnuléEvent
  | RecoursDemandéEvent
  | RecoursRejetéEvent
  | RecoursPasséEnInstructionEvent;
