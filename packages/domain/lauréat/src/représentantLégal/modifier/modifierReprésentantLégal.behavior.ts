import { DomainError, DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { ReprésentantLégalAggregate } from '../représentantLégal.aggregate';

export type ReprésentantLégalModifiéEvent = DomainEvent<
  'ReprésentantLégalModifié-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    nomReprésentantLégal: string;
    modifiéLe: DateTime.RawType;
    modifiéPar: Email.RawType;
  }
>;

export type ModifierOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  nomReprésentantLégal: string;
  dateModification: DateTime.ValueType;
};

export async function modifier(
  this: ReprésentantLégalAggregate,
  {
    identifiantProjet,
    nomReprésentantLégal,
    dateModification,
    identifiantUtilisateur,
  }: ModifierOptions,
) {
  if (this.nomReprésentantLégal === nomReprésentantLégal) {
    throw new ReprésentantLégalIdentifiqueError();
  }

  const event: ReprésentantLégalModifiéEvent = {
    type: 'ReprésentantLégalModifié-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      nomReprésentantLégal,
      modifiéLe: dateModification.formatter(),
      modifiéPar: identifiantUtilisateur.formatter(),
    },
  };

  await this.publish(event);
}

export function applyReprésentantLégalModifié(
  this: ReprésentantLégalAggregate,
  { payload: { nomReprésentantLégal } }: ReprésentantLégalModifiéEvent,
) {
  this.nomReprésentantLégal = nomReprésentantLégal;
}

class ReprésentantLégalIdentifiqueError extends DomainError {
  constructor() {
    super('Le représentant légal est déjà associé à ce projet');
  }
}
