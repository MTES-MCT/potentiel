import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import * as StatutRecours from '../statutRecours.valueType';
import { RecoursAggregate } from '../recours.aggregate';

export type RecoursPasséEnInstructionEvent = DomainEvent<
  'RecoursPasséEnInstruction-V1',
  {
    passéEnInstructionLe: DateTime.RawType;
    passéEnInstructionPar: Email.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
  }
>;

export type InstruireOptions = {
  dateInstruction: DateTime.ValueType;
  identifiantUtilisateur: Email.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
};

export async function passerEnInstruction(
  this: RecoursAggregate,
  { dateInstruction, identifiantUtilisateur, identifiantProjet }: InstruireOptions,
) {
  this.statut.vérifierQueLeChangementDeStatutEstPossibleEn(StatutRecours.enInstruction);

  const event: RecoursPasséEnInstructionEvent = {
    type: 'RecoursPasséEnInstruction-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      passéEnInstructionLe: dateInstruction.formatter(),
      passéEnInstructionPar: identifiantUtilisateur.formatter(),
    },
  };

  await this.publish(event);
}

export function applyRecoursPasséEnInstruction(this: RecoursAggregate) {
  this.statut = StatutRecours.enInstruction;
}
