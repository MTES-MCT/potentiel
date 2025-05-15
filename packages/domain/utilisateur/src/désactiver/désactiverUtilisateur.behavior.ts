import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { UtilisateurAggregate } from '../utilisateur.aggregate';
import { DésactivationPropreCompteError, UtilisateurInconnuError } from '../errors';

export type UtilisateurDésactivéEvent = DomainEvent<
  'UtilisateurDésactivé-V1',
  {
    identifiantUtilisateur: Email.RawType;
    désactivéLe: DateTime.RawType;
    désactivéPar: Email.RawType;
  }
>;

export type DésactiverOptions = {
  identifiantUtilisateur: Email.ValueType;
  désactivéLe: DateTime.ValueType;
  désactivéPar: Email.ValueType;
};

export async function désactiver(
  this: UtilisateurAggregate,
  { identifiantUtilisateur, désactivéLe, désactivéPar }: DésactiverOptions,
) {
  if (!this.existe) {
    throw new UtilisateurInconnuError();
  }
  if (identifiantUtilisateur.estÉgaleÀ(désactivéPar)) {
    throw new DésactivationPropreCompteError();
  }

  const event: UtilisateurDésactivéEvent = {
    type: 'UtilisateurDésactivé-V1',
    payload: {
      identifiantUtilisateur: identifiantUtilisateur.formatter(),
      désactivéLe: désactivéLe.formatter(),
      désactivéPar: désactivéPar.formatter(),
    },
  };
  await this.publish(event);
}

export function applyUtilisateurDésactivé(
  this: UtilisateurAggregate,
  _: UtilisateurDésactivéEvent,
) {
  this.existe = false;
  if (!this.existe) {
    this.rôle = undefined;
  }
}
