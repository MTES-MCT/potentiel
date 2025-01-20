import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { ReprésentantLégalAggregate } from '../../représentantLégal.aggregate';
import { DemandeChangementInexistanteError } from '../changementReprésentantLégal.error';

export type ChangementReprésentantLégalSuppriméEvent = DomainEvent<
  'ChangementReprésentantLégalSupprimé-V1',
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

export async function supprimer(
  this: ReprésentantLégalAggregate,
  { identifiantProjet, identifiantUtilisateur, dateSuppression }: SupprimerOptions,
) {
  if (!this.demande) {
    return;
  }

  const event: ChangementReprésentantLégalSuppriméEvent = {
    type: 'ChangementReprésentantLégalSupprimé-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      suppriméLe: dateSuppression.formatter(),
      suppriméPar: identifiantUtilisateur.formatter(),
    },
  };

  await this.publish(event);
}

export function applyChangementReprésentantLégalSupprimé(
  this: ReprésentantLégalAggregate,
  _: ChangementReprésentantLégalSuppriméEvent,
) {
  this.demande = undefined;
}
