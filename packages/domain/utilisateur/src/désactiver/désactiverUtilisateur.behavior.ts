import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import {
  DésactivationPropreCompteError,
  UtilisateurInconnuError,
  UtilisateurNonActifError,
} from '../errors';
import type { UtilisateurAggregate } from '../utilisateur.aggregate';

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
  if (!this.actif) {
    throw new UtilisateurNonActifError();
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
  this.actif = false;
}
