import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { UtilisateurAggregate } from '../utilisateur.aggregate';
import { UtilisateurInconnuError, UtilisateurDéjàActifError } from '../errors';

export type UtilisateurRéactivéEvent = DomainEvent<
  'UtilisateurRéactivé-V1',
  {
    identifiantUtilisateur: Email.RawType;
    réactivéLe: DateTime.RawType;
    réactivéPar: Email.RawType;
  }
>;

export type RéactiverOptions = {
  identifiantUtilisateur: Email.ValueType;
  réactivéLe: DateTime.ValueType;
  réactivéPar: Email.ValueType;
};

export async function réactiver(
  this: UtilisateurAggregate,
  { identifiantUtilisateur, réactivéLe, réactivéPar }: RéactiverOptions,
) {
  if (!this.existe) {
    throw new UtilisateurInconnuError();
  }
  if (this.actif) {
    throw new UtilisateurDéjàActifError();
  }

  const event: UtilisateurRéactivéEvent = {
    type: 'UtilisateurRéactivé-V1',
    payload: {
      identifiantUtilisateur: identifiantUtilisateur.formatter(),
      réactivéLe: réactivéLe.formatter(),
      réactivéPar: réactivéPar.formatter(),
    },
  };
  await this.publish(event);
}

export function applyUtilisateurRéactivé(this: UtilisateurAggregate, _: UtilisateurRéactivéEvent) {
  this.actif = true;
}
