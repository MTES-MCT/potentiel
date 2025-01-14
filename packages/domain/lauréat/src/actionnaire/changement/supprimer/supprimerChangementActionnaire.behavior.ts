import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { ActionnaireAggregate } from '../../actionnaire.aggregate';
import { ChangementActionnaireInexistanteErreur } from '../../errors';

export type ChangementActionnaireSuppriméEvent = DomainEvent<
  'ChangementActionnaireSupprimé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    suppriméeLe: DateTime.RawType;
    suppriméePar: Email.RawType;
  }
>;

export type SupprimerOptions = {
  dateSuppression: DateTime.ValueType;
  identifiantUtilisateur: Email.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
};

export async function supprimer(
  this: ActionnaireAggregate,
  { identifiantProjet, identifiantUtilisateur, dateSuppression }: SupprimerOptions,
) {
  if (!this.demande) {
    throw new ChangementActionnaireInexistanteErreur();
  }

  const event: ChangementActionnaireSuppriméEvent = {
    type: 'ChangementActionnaireSupprimé-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      suppriméeLe: dateSuppression.formatter(),
      suppriméePar: identifiantUtilisateur.formatter(),
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
