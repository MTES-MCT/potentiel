import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { ReprésentantLégalAggregate } from '../représentantLégal.aggregate';

export type ReprésentantLégalCorrigéEvent = DomainEvent<
  'ReprésentantLégalCorrigé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    nomReprésentantLégal: string;
    corrigéLe: DateTime.RawType;
    corrigéPar: Email.RawType;
  }
>;

export type CorrigerOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  nomReprésentantLégal: string;
  dateCorrection: DateTime.ValueType;
};

export async function corriger(
  this: ReprésentantLégalAggregate,
  {
    identifiantProjet,
    nomReprésentantLégal,
    dateCorrection,
    identifiantUtilisateur,
  }: CorrigerOptions,
) {
  // if (this.nomReprésentantLégal === nomReprésentantLégal) {
  //   // throw new ReprésentantLégalIdentifiqueError();
  // }

  const event: ReprésentantLégalCorrigéEvent = {
    type: 'ReprésentantLégalCorrigé-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      nomReprésentantLégal,
      corrigéLe: dateCorrection.formatter(),
      corrigéPar: identifiantUtilisateur.formatter(),
    },
  };

  await this.publish(event);
}

export function applyReprésentantLégalCorrigé(
  this: ReprésentantLégalAggregate,
  { payload: { nomReprésentantLégal } }: ReprésentantLégalCorrigéEvent,
) {
  this.nomReprésentantLégal = nomReprésentantLégal;
  console.log('🥁 Le nom du représentant légal a été corrigé', this.nomReprésentantLégal);
}

// class ReprésentantLégalIdentifiqueError extends DomainError {
//   constructor() {
//     super('Le représentant légal a déjà été importé');
//   }
// }
