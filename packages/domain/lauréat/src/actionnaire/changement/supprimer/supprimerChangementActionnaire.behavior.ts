import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { ActionnaireAggregate } from '../../actionnaire.aggregate';

export type ChangementActionnaireSuppriméEvent = DomainEvent<
  'ChangementActionnaireSupprimé-V1',
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
  this: ActionnaireAggregate,
  { identifiantProjet, identifiantUtilisateur, dateSuppression }: SupprimerOptions,
) {
  if (!this.demande) {
    return;
  }

  const event: ChangementActionnaireSuppriméEvent = {
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
  _: ChangementActionnaireSuppriméEvent,
) {
  this.demande = undefined;
}
