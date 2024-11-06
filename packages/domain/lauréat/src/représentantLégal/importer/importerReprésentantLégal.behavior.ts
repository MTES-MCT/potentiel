// Third party

// Workspaces
import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

// Package
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
  { payload: { nomReprésentantLégal, importéLe, importéPar } }: ReprésentantLégalImportéEvent,
) {
  this.nomReprésentantLégal = nomReprésentantLégal;
  this.import = {
    importéLe: DateTime.convertirEnValueType(importéLe),
    importéPar: Email.convertirEnValueType(importéPar),
  };
}
