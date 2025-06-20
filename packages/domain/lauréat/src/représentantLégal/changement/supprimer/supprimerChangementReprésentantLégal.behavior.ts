import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { ReprésentantLégalAggregate } from '../../représentantLégal.aggregate';

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

  const event: Lauréat.ReprésentantLégal.ChangementReprésentantLégalSuppriméEvent = {
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
  _: Lauréat.ReprésentantLégal.ChangementReprésentantLégalSuppriméEvent,
) {
  this.demande = undefined;
}
