import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { PuissanceAggregate } from '../puissance.aggregate';
import {
  PuissanceIdentiqueError,
  PuissanceIntrouvableError,
  PuissanceNulleOuNégativeError,
} from '../errors';

export type PuissanceModifiéeEvent = DomainEvent<
  'PuissanceModifiée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    puissance: number;
    modifiéeLe: DateTime.RawType;
    modifiéePar: Email.RawType;
    raison?: string;
  }
>;

export type ModifierOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  puissance: number;
  dateModification: DateTime.ValueType;
  raison?: string;
};

export async function modifier(
  this: PuissanceAggregate,
  {
    identifiantProjet,
    puissance,
    dateModification,
    identifiantUtilisateur,
    raison,
  }: ModifierOptions,
) {
  if (!this.puissance) {
    throw new PuissanceIntrouvableError();
  }

  if (this.puissance === puissance) {
    throw new PuissanceIdentiqueError();
  }

  if (puissance <= 0) {
    throw new PuissanceNulleOuNégativeError();
  }

  const event: PuissanceModifiéeEvent = {
    type: 'PuissanceModifiée-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      puissance,
      modifiéeLe: dateModification.formatter(),
      modifiéePar: identifiantUtilisateur.formatter(),
      raison,
    },
  };

  await this.publish(event);
}

export function applyPuissanceModifiée(
  this: PuissanceAggregate,
  { payload: { puissance } }: PuissanceModifiéeEvent,
) {
  this.puissance = puissance;
}
