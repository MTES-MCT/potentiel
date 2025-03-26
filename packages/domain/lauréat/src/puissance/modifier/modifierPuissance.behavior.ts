import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { PuissanceAggregate } from '../puissance.aggregate';

export type PuissanceModifiéeEvent = DomainEvent<
  'PuissanceModifiée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    puissance: number;
    modifiéeLe: DateTime.RawType;
    modifiéePar: Email.RawType;
  }
>;

export type ModifierOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  puissance: number;
  dateModification: DateTime.ValueType;
};

export async function modifier(
  this: PuissanceAggregate,
  { identifiantProjet, puissance, dateModification, identifiantUtilisateur }: ModifierOptions,
) {
  const event: PuissanceModifiéeEvent = {
    type: 'PuissanceModifiée-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      puissance,
      modifiéeLe: dateModification.formatter(),
      modifiéePar: identifiantUtilisateur.formatter(),
    },
  };

  await this.publish(event);
}

export function applypuissanceModifiée(
  this: PuissanceAggregate,
  { payload: { puissance } }: PuissanceModifiéeEvent,
) {
  this.puissance = puissance;
}
