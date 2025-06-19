import { DomainError } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { ReprésentantLégalAggregate } from '../représentantLégal.aggregate';

export type ImporterOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomReprésentantLégal: string;
  importéLe: DateTime.ValueType;
  importéPar: Email.ValueType;
};

export async function importer(
  this: ReprésentantLégalAggregate,
  { identifiantProjet, nomReprésentantLégal, importéLe, importéPar }: ImporterOptions,
) {
  if (this.représentantLégal?.nom) {
    throw new ReprésentantLégalDéjàImportéError();
  }

  const event: Lauréat.ReprésentantLégal.ReprésentantLégalImportéEvent = {
    type: 'ReprésentantLégalImporté-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      nomReprésentantLégal,
      importéLe: importéLe.formatter(),
      importéPar: importéPar.formatter(),
    },
  };

  await this.publish(event);
}

export function applyReprésentantLégalImporté(
  this: ReprésentantLégalAggregate,
  { payload: { nomReprésentantLégal } }: Lauréat.ReprésentantLégal.ReprésentantLégalImportéEvent,
) {
  this.représentantLégal = {
    nom: nomReprésentantLégal,
    type: Lauréat.ReprésentantLégal.TypeReprésentantLégal.inconnu,
  };
}

class ReprésentantLégalDéjàImportéError extends DomainError {
  constructor() {
    super('Le représentant légal a déjà été importé');
  }
}
