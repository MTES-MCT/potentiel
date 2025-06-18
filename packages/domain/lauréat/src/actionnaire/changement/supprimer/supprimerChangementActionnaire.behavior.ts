import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { ActionnaireAggregate } from '../../actionnaire.aggregate';

export type SupprimerOptions = {
  dateSuppression: DateTime.ValueType;
  identifiantUtilisateur: Email.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
};

export async function supprimerDemandeChangement(
  this: ActionnaireAggregate,
  { identifiantProjet, identifiantUtilisateur, dateSuppression }: SupprimerOptions,
) {
  if (!this.demande) {
    return;
  }

  const event: Lauréat.Actionnaire.ChangementActionnaireSuppriméEvent = {
    type: 'ChangementActionnaireSupprimé-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      suppriméLe: dateSuppression.formatter(),
      suppriméPar: identifiantUtilisateur.formatter(),
    },
  };

  await this.publish(event);
}

export function applyChangementActionnaireSupprimé(
  this: ActionnaireAggregate,
  _: Lauréat.Actionnaire.ChangementActionnaireSuppriméEvent,
) {
  this.demande = undefined;
}
