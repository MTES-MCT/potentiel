import { mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { TrouverUtilisateurQuery } from '@potentiel-domain/utilisateur';

export class UtilisateurNonTrouvéError extends Error {
  constructor() {
    super("L'utilisateur n'a pas été trouvé");
  }
}

export const getRôleFromEmail = async (identifiantUtilisateur: string) => {
  const utilisateur = await mediator.send<TrouverUtilisateurQuery>({
    type: 'System.Utilisateur.Query.TrouverUtilisateur',
    data: {
      identifiantUtilisateur,
    },
  });

  if (Option.isNone(utilisateur)) {
    throw new UtilisateurNonTrouvéError();
  }

  return utilisateur.rôle;
};
