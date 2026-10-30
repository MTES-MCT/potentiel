import { mediator } from 'mediateur';

import { OperationRejectedError } from '@potentiel-domain/core';
import type { Accès, IdentifiantProjet } from '@potentiel-domain/projet';
import type { Utilisateur } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

type RécupérerLesProjetsAuxquelsInviterLePorteurProps = {
  utilisateur: Utilisateur.ValueType;
  utilisateurInvité: string;
  identifiantProjet: IdentifiantProjet.ValueType;
  invitationMultiple: boolean;
};
export const récupérerLesProjetsAuxquelsInviterLePorteur = async ({
  identifiantProjet,
  invitationMultiple,
  utilisateur,
  utilisateurInvité,
}: RécupérerLesProjetsAuxquelsInviterLePorteurProps) => {
  if (invitationMultiple) {
    if (!utilisateur.rôle.estPorteur()) {
      throw new OperationRejectedError('Cette action est réservée aux porteurs de projet');
    }

    const accèsInvité = await mediator.send<Accès.ListerAccèsQuery>({
      type: 'Projet.Accès.Query.ListerAccès',
      data: {
        identifiantUtilisateur: utilisateurInvité,
      },
    });

    const accèsPorteur = await mediator.send<Accès.ListerAccèsQuery>({
      type: 'Projet.Accès.Query.ListerAccès',
      data: {
        identifiantUtilisateur: utilisateur.identifiantUtilisateur.email,
      },
    });

    const projetsInvité = new Set(accèsInvité.items.map((a) => a.identifiantProjet.formatter()));

    return accèsPorteur.items
      .filter((accès) => !projetsInvité.has(accès.identifiantProjet.formatter()))
      .map((accès) => accès.identifiantProjet.formatter());
  }

  const porteursAyantAccèsAuProjet = await mediator.send<Accès.ConsulterAccèsQuery>({
    type: 'Projet.Accès.Query.ConsulterAccès',
    data: {
      identifiantProjet: identifiantProjet.formatter(),
    },
  });

  return Option.isSome(porteursAyantAccèsAuProjet) &&
    !porteursAyantAccèsAuProjet.utilisateursAyantAccès.some(
      (utilisateur) => utilisateur.email === utilisateurInvité,
    )
    ? [identifiantProjet.formatter()]
    : [];
};
