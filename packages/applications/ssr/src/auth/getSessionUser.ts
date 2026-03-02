import { IncomingMessage, ServerResponse } from 'node:http';

import { Role, Utilisateur } from '@potentiel-domain/utilisateur';
import { OperationRejectedError } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';
import { PotentielUtilisateur } from '@potentiel-applications/request-context';

import { auth } from '.';

import { getUtilisateurFromEmail } from './getUtilisateurFromEmail';
import { getLastUsedProvider } from './providers/getLastUsedProvider';
import { getProviderConfiguration } from './providers/getProviderConfiguration';

export type GetUtilisateur = (
  req: IncomingMessage,
  res: ServerResponse,
) => Promise<PotentielUtilisateur | undefined>;

export const getSessionUser: GetUtilisateur = async (req) => {
  const headers = new Headers(req.headers as Record<string, string>);
  const session = await auth.api.getSession({ headers });

  if (!session?.user) {
    return undefined;
  }

  const { email, name: nom } = session.user;
  const providerId = getLastUsedProvider({ headers });

  const accountUrl = providerId && getProviderConfiguration(providerId)?.accountUrl;

  const utilisateur = await getUtilisateurFromEmail(email);
  if (Option.isSome(utilisateur)) {
    if (utilisateur.désactivé) {
      throw new OperationRejectedError(`Forbidden`);
    }
    return {
      ...utilisateur,
      nom,
      accountUrl,
    };
  }

  return {
    ...Utilisateur.convertirEnValueType({ rôle: Role.visiteur.nom, identifiantUtilisateur: email }),
    nom,
    accountUrl,
  };
};
