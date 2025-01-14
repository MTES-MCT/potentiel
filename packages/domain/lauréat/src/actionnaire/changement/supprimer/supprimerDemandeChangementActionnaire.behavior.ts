import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { ActionnaireAggregate } from '../../actionnaire.aggregate';
import { DemandeChangementActionnaireInexistanteErreur } from '../../errors';

export type DemandeChangementActionnaireSuppriméeEvent = DomainEvent<
  'DemandeChangementActionnaireSupprimée-V1',
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
    throw new DemandeChangementActionnaireInexistanteErreur();
  }

  const event: DemandeChangementActionnaireSuppriméeEvent = {
    type: 'DemandeChangementActionnaireSupprimée-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      suppriméeLe: dateSuppression.formatter(),
      suppriméePar: identifiantUtilisateur.formatter(),
    },
  };

  await this.publish(event);
}

export function applyDemandeChangementActionnaireSupprimée(
  this: ActionnaireAggregate,
  _: DemandeChangementActionnaireSuppriméeEvent,
) {
  this.demande = undefined;
}
