import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { ÉliminéAggregate } from '../éliminé.aggregate';

export type ÉliminéArchivéEvent = DomainEvent<
  'ÉliminéArchivé-V1',
  {
    archivéLe: DateTime.RawType;
    archivéPar: Email.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
  }
>;

export type ArchiverOptions = {
  dateArchive: DateTime.ValueType;
  identifiantUtilisateur: Email.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
};

export async function archiver(
  this: ÉliminéAggregate,
  { dateArchive, identifiantUtilisateur, identifiantProjet }: ArchiverOptions,
) {
  if (!this.estArchivé) {
    const event: ÉliminéArchivéEvent = {
      type: 'ÉliminéArchivé-V1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        archivéLe: dateArchive.formatter(),
        archivéPar: identifiantUtilisateur.formatter(),
      },
    };

    await this.publish(event);
  }
}

export function applyÉliminéArchivé(this: ÉliminéAggregate, _: ÉliminéArchivéEvent) {
  this.estArchivé = true;
}
