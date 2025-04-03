import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { PuissanceAggregate } from '../../puissance.aggregate';

export type ChangementPuissanceSuppriméEvent = DomainEvent<
  'ChangementPuissanceSupprimé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    suppriméLe: DateTime.RawType;
    suppriméPar: Email.RawType;
  }
>;

export type SupprimerOptions = {
  dateSuppression: DateTime.ValueType;
  identifiantUtilisateur: Email.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
};

export async function supprimerDemandeChangement(
  this: PuissanceAggregate,
  { identifiantProjet, identifiantUtilisateur, dateSuppression }: SupprimerOptions,
) {
  if (!this.demande) {
    return;
  }

  const event: ChangementPuissanceSuppriméEvent = {
    type: 'ChangementPuissanceSupprimé-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      suppriméLe: dateSuppression.formatter(),
      suppriméPar: identifiantUtilisateur.formatter(),
    },
  };

  await this.publish(event);
}

export function applyChangementPuissanceSupprimé(
  this: PuissanceAggregate,
  _: ChangementPuissanceSuppriméEvent,
) {
  this.demande = undefined;
}
