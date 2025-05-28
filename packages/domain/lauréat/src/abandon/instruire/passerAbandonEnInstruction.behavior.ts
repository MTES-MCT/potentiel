import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { InvalidOperationError } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { AbandonAggregate } from '../abandon.aggregate';

export type InstruireOptions = {
  dateInstruction: DateTime.ValueType;
  identifiantUtilisateur: Email.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
};

export async function passerEnInstruction(
  this: AbandonAggregate,
  { dateInstruction, identifiantUtilisateur, identifiantProjet }: InstruireOptions,
) {
  this.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
    Lauréat.Abandon.StatutAbandon.enInstruction,
  );

  if (this.demande.instruction?.instruitPar.estÉgaleÀ(identifiantUtilisateur)) {
    throw new AbandonDéjàEnInstructionAvecLeMêmeAdministrateurError();
  }

  const event: Lauréat.Abandon.AbandonPasséEnInstructionEvent = {
    type: 'AbandonPasséEnInstruction-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      passéEnInstructionLe: dateInstruction.formatter(),
      passéEnInstructionPar: identifiantUtilisateur.formatter(),
    },
  };

  await this.publish(event);
}

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

class AbandonDéjàEnInstructionAvecLeMêmeAdministrateurError extends InvalidOperationError {
  constructor() {
    super("L'abandon est déjà en instruction avec le même administrateur");
  }
}
