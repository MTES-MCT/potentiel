import { DomainError, DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { ReprésentantLégalAggregate } from '../représentantLégal.aggregate';

export type ReprésentantLégalImportéEvent = DomainEvent<
  'ReprésentantLégalImporté-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    nomReprésentantLégal: string;
    importéLe: DateTime.RawType;
    importéPar: Email.RawType;
  }
>;

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
  if (this.nomReprésentantLégal) {
    throw new ReprésentantLégalDéjàImportéError();
  }

  const event: ReprésentantLégalImportéEvent = {
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
  { payload: { nomReprésentantLégal } }: ReprésentantLégalImportéEvent,
) {
  this.nomReprésentantLégal = nomReprésentantLégal;
}

class ReprésentantLégalDéjàImportéError extends DomainError {
  constructor() {
    super('Le représentant légal a déjà été importé');
  }
}
