import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { AbandonAggregate } from '../abandon.aggregate';
import * as StatutAbandon from '../statutAbandon.valueType';

export type AbandonInstruitEvent = DomainEvent<
  'AbandonInstruit-V1',
  {
    instruitLe: DateTime.RawType;
    instruitPar: Email.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
  }
>;

export type InstruireOptions = {
  dateInstruction: DateTime.ValueType;
  identifiantUtilisateur: Email.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
};

export async function instruire(
  this: AbandonAggregate,
  { dateInstruction, identifiantUtilisateur, identifiantProjet }: InstruireOptions,
) {
  this.statut.vérifierQueLeChangementDeStatutEstPossibleEn(StatutAbandon.enInstruction);

  const event: AbandonInstruitEvent = {
    type: 'AbandonInstruit-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      instruitLe: dateInstruction.formatter(),
      instruitPar: identifiantUtilisateur.formatter(),
    },
  };

  await this.publish(event);
}

export function applyAbandonInstruit(this: AbandonAggregate) {
  this.statut = StatutAbandon.enInstruction;
}
