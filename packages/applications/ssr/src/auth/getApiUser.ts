import { jwtVerify } from 'jose';
import z from 'zod';

import { OperationRejectedError } from '@potentiel-domain/core';
import { Utilisateur } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

import type { GetUtilisateur } from './getSessionUser';
import { getUtilisateurFromEmail } from './getUtilisateurFromEmail';
import { getKeycloakConfiguration } from './providers/getProviderConfiguration';
import { getJWKS } from './providers/openid';

const jwtSchema = z.object({ email: z.string() });

// API clients are authenticated by Authorization header, with tokens issued by Keycloak.
export const getApiUser: GetUtilisateur = async ({ headers }) => {
  const authHeader = headers.get('authorization') ?? '';
  if (!authHeader.toLowerCase().startsWith('bearer ')) {
    return;
  }

  const accessToken = authHeader.slice('bearer '.length);

  const { issuer } = getKeycloakConfiguration();
  const discoveryUrl = `${issuer}/.well-known/openid-configuration`;
  const jwks = await getJWKS(discoveryUrl);
  const { payload } = await jwtVerify(accessToken, jwks);
  const { email } = jwtSchema.parse(payload);
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
};
