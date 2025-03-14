import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { UtilisateurAggregate } from '../utilisateur.aggregate';

export type AccèsProjetRetiréEvent = DomainEvent<
  'AccèsProjetRetiré-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    identifiantUtilisateur: Email.RawType;
    retiréLe: DateTime.RawType;
    retiréPar: Email.RawType;
    cause?: 'changement-producteur';
  }
>;

type RetirerAccèsProjetOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  retiréLe: DateTime.ValueType;
  retiréPar: Email.ValueType;
  cause?: 'changement-producteur';
};

export async function retirerAccèsProjet(
  this: UtilisateurAggregate,
  {
    identifiantProjet,
    identifiantUtilisateur,
    retiréLe,
    retiréPar,
    cause,
  }: RetirerAccèsProjetOptions,
) {
  const event: AccèsProjetRetiréEvent = {
    type: 'AccèsProjetRetiré-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      identifiantUtilisateur: identifiantUtilisateur.formatter(),
      retiréLe: retiréLe.formatter(),
      retiréPar: retiréPar.formatter(),
      cause,
    },
  };
  await this.publish(event);
}

export function applyAccèsProjetRetiré(
  this: UtilisateurAggregate,
  { payload: { identifiantProjet } }: AccèsProjetRetiréEvent,
) {
  this.projets.delete(identifiantProjet);
}
