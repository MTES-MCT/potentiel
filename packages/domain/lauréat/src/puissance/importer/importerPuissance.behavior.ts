import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { PuissanceAggregate } from '../puissance.aggregate';
import { PuissanceDéjàImportéeError } from '../errors';

export type PuissanceImportéeEvent = DomainEvent<
  'PuissanceImportée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    puissance: number;
    importéeLe: DateTime.RawType;
  }
>;

export type ImporterOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  puissance: number;
  importéeLe: DateTime.ValueType;
};

export async function importer(
  this: PuissanceAggregate,
  { identifiantProjet, puissance, importéeLe }: ImporterOptions,
) {
  if (this.puissance) {
    throw new PuissanceDéjàImportéeError();
  }

  const event: PuissanceImportéeEvent = {
    type: 'PuissanceImportée-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      puissance,
      importéeLe: importéeLe.formatter(),
    },
  };

  await this.publish(event);
}

export function applyPuissanceImportée(
  this: PuissanceAggregate,
  { payload: { puissance, identifiantProjet } }: PuissanceImportéeEvent,
) {
  this.identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjet);
  this.puissance = puissance;
}
