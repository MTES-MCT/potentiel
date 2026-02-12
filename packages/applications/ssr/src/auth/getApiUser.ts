import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';
import { OperationRejectedError } from '@potentiel-domain/core';
import { Utilisateur } from '@potentiel-domain/utilisateur';

import { auth } from '.';

import { GetUtilisateur } from './getSessionUser';
import { getUtilisateurFromEmail } from './getUtilisateurFromEmail';

// API clients are authenticated by Authorization header

export const getApiUser: GetUtilisateur = async (req) => {
  const session = await auth.api.getSession({
    headers: new Headers(req.headers as Record<string, string>),
  });

  console.log(session);

  const email = session?.user?.email;
  if (email) {
    const utilisateur = await getUtilisateurFromEmail(email);
    if (Option.isNone(utilisateur)) {
      getLogger('getUtilisateurFromAccessToken').warn('Utilisateur non trouvé', {
        email,
      });
      throw new OperationRejectedError(`Forbidden`);
    }
    if (utilisateur.désactivé) {
      getLogger('getUtilisateurFromAccessToken').warn('Utilisateur désactivé', {
        email,
      });
      throw new OperationRejectedError(`Forbidden`);
    }
    return Utilisateur.bind(utilisateur);
  }
};
