import type {
  RecoursAccordéEvent,
  RecoursAccordéV1Event,
} from './accorder/recoursAccordé.event.js';
import type { RecoursAnnuléEvent } from './annuler/annulerRecours.event.js';
import type { RecoursDemandéEvent } from './demander/demanderRecours.event.js';
import type { RecoursPasséEnInstructionEvent } from './instruire/passerRecoursEnInstruction.event.js';
import type { RecoursRejetéEvent } from './rejeter/rejeterRecours.event.js';

export type RecoursEvent =
  | RecoursAccordéV1Event
  | RecoursAccordéEvent
  | RecoursAnnuléEvent
  | RecoursDemandéEvent
  | RecoursRejetéEvent
  | RecoursPasséEnInstructionEvent;
