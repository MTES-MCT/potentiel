import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

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
};

export async function réclamer(
  this: UtilisateurAggregate,
  { identifiantProjet, identifiantUtilisateur, réclaméLe }: RéclamerProjetOptions,
) {
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
