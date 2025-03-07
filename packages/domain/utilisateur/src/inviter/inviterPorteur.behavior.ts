import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { UtilisateurAggregate } from '../utilisateur.aggregate';
import { AccèsProjetDéjàAutoriséError, AuMoinsUnProjetRequisError } from '../errors';

export type AccèsAuProjetAutoriséEvent = DomainEvent<
  'AccèsAuProjetAutorisé-V1',
  {
    identifiantUtilisateur: Email.RawType;
    identifiantsProjet: IdentifiantProjet.RawType[];
    autoriséLe: DateTime.RawType;
    autoriséPar: Email.RawType;
    source: 'invitation' | 'réclamation' | 'candidature';
    nouvelUtilisateur?: true;
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

  const event: AccèsAuProjetAutoriséEvent = {
    type: 'AccèsAuProjetAutorisé-V1',
    payload: {
      identifiantsProjet: nouveauxIdentifiantsProjet.map((identifiantProjet) =>
        identifiantProjet.formatter(),
      ),
      identifiantUtilisateur: identifiantUtilisateur.formatter(),
      autoriséLe: invitéLe.formatter(),
      autoriséPar: invitéPar.formatter(),
      source: 'invitation',
      nouvelUtilisateur: this.existe ? undefined : true,
    },
  };

  await this.publish(event);
}

export function applyAccèsAuProjetAutorisé(
  this: UtilisateurAggregate,
  { payload: { identifiantsProjet } }: AccèsAuProjetAutoriséEvent,
) {
  this.existe = true;
  for (const identifiantProjet of identifiantsProjet) {
    this.projets.add(identifiantProjet);
  }
}
