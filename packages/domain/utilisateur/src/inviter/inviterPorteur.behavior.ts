import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { UtilisateurAggregate } from '../utilisateur.aggregate';
import { AccèsProjetDéjàAutoriséError, AuMoinsUnProjetRequisError } from '../errors';

export type PorteurInvitéEvent = DomainEvent<
  'PorteurInvité-V1',
  {
    identifiantUtilisateur: Email.RawType;
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
  if (identifiantsProjet.length === 0) {
    throw new AuMoinsUnProjetRequisError();
  }

  const nouveauxIdentifiantsProjet = identifiantsProjet.filter(
    (identifiantProjet) => !this.aAccèsAuProjet(identifiantProjet),
  );

  if (this.existe && nouveauxIdentifiantsProjet.length === 0) {
    throw new AccèsProjetDéjàAutoriséError();
  }

  const event: PorteurInvitéEvent = {
    type: 'PorteurInvité-V1',
    payload: {
      identifiantsProjet: nouveauxIdentifiantsProjet.map((identifiantProjet) =>
        identifiantProjet.formatter(),
      ),
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
  for (const identifiantProjet of identifiantsProjet) {
    this.projets.add(identifiantProjet);
  }
}
