import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { UtilisateurAggregate } from '../utilisateur.aggregate';
import { UtilisateurNonPorteurError } from '../errors';
import { Role } from '..';

export type PorteurInvitéEvent = DomainEvent<
  'PorteurInvité-V1',
  {
    identifiantUtilisateur: Email.RawType;
    /**
     * Cette donnée est informative (notifications)
     * et ne doit pas être utilisé pour gérer les accès aux projets.
     * Voir Projet.Accès pour cela.
     **/
    identifiantsProjet: IdentifiantProjet.RawType[];
    invitéLe: DateTime.RawType;
    invitéPar: Email.RawType;
  }
>;

export type InviterPorteurOptions = {
  identifiantsProjet: IdentifiantProjet.ValueType[];
  identifiantUtilisateur: Email.ValueType;
  invitéPar: Email.ValueType;
  invitéLe: DateTime.ValueType;
};

export async function inviterPorteur(
  this: UtilisateurAggregate,
  { identifiantsProjet, identifiantUtilisateur, invitéLe, invitéPar }: InviterPorteurOptions,
) {
  if (this.existe && !this.rôle.estÉgaleÀ(Role.porteur)) {
    throw new UtilisateurNonPorteurError();
  }

  const event: PorteurInvitéEvent = {
    type: 'PorteurInvité-V1',
    payload: {
      identifiantsProjet: identifiantsProjet
        .filter((identifiantProjet) => !this.aAccèsAuProjet(identifiantProjet))
        .map((identifiantProjet) => identifiantProjet.formatter()),
      identifiantUtilisateur: identifiantUtilisateur.formatter(),
      invitéLe: invitéLe.formatter(),
      invitéPar: invitéPar.formatter(),
    },
  };

  await this.publish(event);
}

export function applyPorteurInvité(
  this: UtilisateurAggregate,
  { payload: { identifiantsProjet } }: PorteurInvitéEvent,
) {
  this.existe = true;
  this.actif = true;
  if (this.existe) {
    this.rôle = Role.porteur;
  }
  for (const identifiantProjet of identifiantsProjet) {
    this.projets.add(identifiantProjet);
  }
}
