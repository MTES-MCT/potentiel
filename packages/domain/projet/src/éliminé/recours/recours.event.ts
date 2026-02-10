import { RecoursAccordéEvent } from './accorder/recoursAccordé.event.js';
import { RecoursAnnuléEvent } from './annuler/annulerRecours.event.js';
import { RecoursDemandéEvent } from './demander/demanderRecours.event.js';
import { RecoursPasséEnInstructionEvent } from './instruire/passerRecoursEnInstruction.event.js';
import { RecoursRejetéEvent } from './rejeter/rejeterRecours.event.js';

export type RecoursEvent =
  | RecoursAccordéEvent
  | RecoursAnnuléEvent
  | RecoursDemandéEvent
  | RecoursRejetéEvent
  | RecoursPasséEnInstructionEvent;
