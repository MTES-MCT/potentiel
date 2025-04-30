import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent, InvalidOperationError } from '@potentiel-domain/core';

import { UtilisateurAggregate } from '../utilisateur.aggregate';

export type ProjetRéclaméEvent = DomainEvent<
  'ProjetRéclamé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    identifiantUtilisateur: Email.RawType;
    réclaméLe: DateTime.RawType;
  }
>;

type RéclamerProjetOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  réclaméLe: DateTime.ValueType;
  aLeMêmeEmailQueLaCandidature: boolean;
  connaîtLePrixEtNuméroCRE?: boolean;
  estNotifié: boolean;
};

export async function réclamer(
  this: UtilisateurAggregate,
  {
    identifiantProjet,
    identifiantUtilisateur,
    réclaméLe,
    aLeMêmeEmailQueLaCandidature,
    connaîtLePrixEtNuméroCRE,
    estNotifié,
  }: RéclamerProjetOptions,
) {
  // NB : on ne vérifie pas ici que le projet n'est pas déjà assigné à un Porteur
  // Cette vérification est effectuée au niveau du middleware des permissions

  if (!estNotifié) {
    throw new ProjetNonNotiféError();
  }

  if (connaîtLePrixEtNuméroCRE === false) {
    throw new PrixEtNuméroCRENonCorrespondantError();
  }

  if (!aLeMêmeEmailQueLaCandidature && !connaîtLePrixEtNuméroCRE) {
    throw new EmailNonCorrespondantError();
  }

  const event: ProjetRéclaméEvent = {
    type: 'ProjetRéclamé-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      identifiantUtilisateur: identifiantUtilisateur.formatter(),
      réclaméLe: réclaméLe.formatter(),
    },
  };
  await this.publish(event);
}

export function applyProjetRéclamé(
  this: UtilisateurAggregate,
  { payload: { identifiantProjet } }: ProjetRéclaméEvent,
) {
  this.projets.add(identifiantProjet);
}

class EmailNonCorrespondantError extends InvalidOperationError {
  constructor() {
    super("L'email du porteur ne correspond pas à l'email de la candidature");
  }
}

class PrixEtNuméroCRENonCorrespondantError extends InvalidOperationError {
  constructor() {
    super('Le prix et le numéro CRE spécifiés ne correspondent pas à ceux de la candidature');
  }
}

class ProjetNonNotiféError extends InvalidOperationError {
  constructor() {
    super("Le projet n'est pas notifié");
  }
}
