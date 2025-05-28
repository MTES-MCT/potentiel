import { DateTime, Email } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { AbandonAggregate } from '../abandon.aggregate';

export function applyAbandonPasséEnInstruction(
  this: AbandonAggregate,
  {
    payload: { passéEnInstructionLe, passéEnInstructionPar },
  }: Lauréat.Abandon.AbandonPasséEnInstructionEvent,
) {
  this.statut = Lauréat.Abandon.StatutAbandon.enInstruction;
  this.demande.instruction = {
    démarréLe:
      this.demande.instruction?.démarréLe ?? DateTime.convertirEnValueType(passéEnInstructionLe),
    instruitPar: Email.convertirEnValueType(passéEnInstructionPar),
  };
}
