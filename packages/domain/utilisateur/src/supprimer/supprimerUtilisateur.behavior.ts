import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { UtilisateurAggregate } from '../utilisateur.aggregate';
import {
  SuppressionPorteurError,
  SuppressionPropreCompteError,
  UtilisateurInconnuError,
} from '../errors';
import { Role } from '..';

export type UtilisateurSuppriméEvent = DomainEvent<
  'UtilisateurSupprimé-V1',
  {
    identifiantUtilisateur: Email.RawType;
    suppriméLe: DateTime.RawType;
    suppriméPar: Email.RawType;
  }
>;

export type SupprimerOptions = {
  identifiantUtilisateur: Email.ValueType;
  suppriméLe: DateTime.ValueType;
  suppriméPar: Email.ValueType;
};

export async function supprimer(
  this: UtilisateurAggregate,
  { identifiantUtilisateur, suppriméLe, suppriméPar }: SupprimerOptions,
) {
  if (!this.existe) {
    throw new UtilisateurInconnuError();
  }
  if (identifiantUtilisateur.estÉgaleÀ(suppriméPar)) {
    throw new SuppressionPropreCompteError();
  }
  if (this.rôle.estÉgaleÀ(Role.porteur)) {
    throw new SuppressionPorteurError();
  }

  const event: UtilisateurSuppriméEvent = {
    type: 'UtilisateurSupprimé-V1',
    payload: {
      identifiantUtilisateur: identifiantUtilisateur.formatter(),
      suppriméLe: suppriméLe.formatter(),
      suppriméPar: suppriméPar.formatter(),
    },
  };
  await this.publish(event);
}

export function applyUtilisateurSupprimé(this: UtilisateurAggregate, _: UtilisateurSuppriméEvent) {
  this.existe = false;
  if (!this.existe) {
    this.rôle = undefined;
  }
}
