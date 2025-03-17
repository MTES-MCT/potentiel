import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent, InvalidOperationError } from '@potentiel-domain/core';

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
  estLeMêmeUtilisateur: boolean;
  utilisateurNAPasAccèsAuProjet: boolean;
};

export async function retirerAccèsProjet(
  this: UtilisateurAggregate,
  {
    identifiantProjet,
    identifiantUtilisateur,
    retiréLe,
    retiréPar,
    cause,
    estLeMêmeUtilisateur,
    utilisateurNAPasAccèsAuProjet,
  }: RetirerAccèsProjetOptions,
) {
  if (estLeMêmeUtilisateur) {
    throw new RetraitDeSesAccèsProjetError();
  }

  if (utilisateurNAPasAccèsAuProjet) {
    throw new UtilisateurAPasAccèsAuProjetError();
  }

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

export class RetraitDeSesAccèsProjetError extends InvalidOperationError {
  constructor() {
    super('Vous ne pouvez pas retirer vos accès à ce projet');
  }
}

export class UtilisateurAPasAccèsAuProjetError extends InvalidOperationError {
  constructor() {
    super("L'utilisateur n'a pas accès au projet");
  }
}
