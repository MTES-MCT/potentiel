import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { UtilisateurAggregate } from '../utilisateur.aggregate';

export type PorteurInvitéEvent = DomainEvent<
  'PorteurInvité-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    identifiantUtilisateur: Email.RawType;
    invitéPar: Email.RawType;
    invitéLe: DateTime.RawType;
  }
>;

export type InviterPorteurOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  invitéPar: Email.ValueType;
  invitéLe: DateTime.ValueType;
};

export async function inviterPorteur(
  this: UtilisateurAggregate,
  { identifiantProjet, identifiantUtilisateur, invitéLe, invitéPar }: InviterPorteurOptions,
) {
  const event: PorteurInvitéEvent = {
    type: 'PorteurInvité-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      identifiantUtilisateur: identifiantUtilisateur.formatter(),
      invitéLe: invitéLe.formatter(),
      invitéPar: invitéPar.formatter(),
    },
  };

  await this.publish(event);
}

export function applyPorteurInvité(
  this: UtilisateurAggregate,
  { payload: { identifiantProjet } }: PorteurInvitéEvent,
) {
  this.existe = true;
  this.projets.add(IdentifiantProjet.convertirEnValueType(identifiantProjet));
}
