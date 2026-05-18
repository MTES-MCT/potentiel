import { mediator } from 'mediateur';

import type { Accès, IdentifiantProjet } from '@potentiel-domain/projet';
import type { ListerUtilisateursQuery } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

import type { Recipient } from '#sendEmail';

export const listerPorteursRecipients = async (
  identifiantProjet: IdentifiantProjet.ValueType,
): Promise<Recipient[]> => {
  const accèsProjet = await mediator.send<Accès.ConsulterAccèsQuery>({
    type: 'Projet.Accès.Query.ConsulterAccès',
    data: {
      identifiantProjet: identifiantProjet.formatter(),
    },
  });

  if (Option.isNone(accèsProjet)) {
    return [];
  }

  const identifiantsUtilisateur = accèsProjet.utilisateursAyantAccès.map((utilisateur) =>
    utilisateur.formatter(),
  );

  const listeUtilisateursDésactivés = await mediator.send<ListerUtilisateursQuery>({
    type: 'Utilisateur.Query.ListerUtilisateurs',
    data: {
      actif: false,
      identifiantsUtilisateur,
    },
  });

  const identifiantsUtilisateurDésactivés = new Set(
    listeUtilisateursDésactivés.items.map(({ identifiantUtilisateur }) =>
      identifiantUtilisateur.formatter(),
    ),
  );

  return identifiantsUtilisateur
    .filter((id) => !identifiantsUtilisateurDésactivés.has(id))
    .map((email) => email);
};
