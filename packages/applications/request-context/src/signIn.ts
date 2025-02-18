import { Account } from 'next-auth';
import { JWT } from 'next-auth/jwt';

import { getLogger } from '@potentiel-libraries/monitoring';

import { getUtilisateurFromProvider } from './getUtilisateur';

export async function signIn(params: { token: JWT; account: Account }): Promise<JWT> {
  const { token, account } = params;
  const { email } = token;
  const { sub, expires_at = 0, provider, access_token = '' } = account;
  const expiresAtInMs = expires_at * 1000;

  getLogger('Auth').debug(`User logged in`, { sub, expiresAt: new Date(expiresAtInMs) });

  const utilisateur = await getUtilisateurFromProvider(provider, email, access_token);

  return {
    ...token,
    provider,
    idToken: account.id_token,
    expiresAt: expiresAtInMs,
    refreshToken: account.refresh_token,
    utilisateur,
  };
}
