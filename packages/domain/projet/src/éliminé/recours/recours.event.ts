import { RecoursAccordéEvent } from './accorder/recoursAccordé.event';
import { RecoursAnnuléEvent } from './annuler/annulerRecours.event';
import { RecoursDemandéEvent } from './demander/demanderRecours.event';
import { RecoursPasséEnInstructionEvent } from './instruire/passerRecoursEnInstruction.event';
import { RecoursRejetéEvent } from './rejeter/rejeterRecours.event';

export type RecoursEvent =
  | RecoursAccordéEvent
  | RecoursAnnuléEvent
  | RecoursDemandéEvent
  | RecoursRejetéEvent
  | RecoursPasséEnInstructionEvent;
