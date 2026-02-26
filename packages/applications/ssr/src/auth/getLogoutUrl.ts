import { headers } from 'next/headers';

import { getLogger } from '@potentiel-libraries/monitoring';

import { auth } from '.';

import { getProviderConfiguration } from './providers/getProviderConfiguration';
import { getOpenIdConfiguration } from './providers/openid';

const getIdToken = async (providerId: string) => {
  try {
    const tokens = await auth.api.getAccessToken({
      body: { providerId },
      headers: headers(),
    });
    return tokens.idToken;
  } catch (error) {
    getLogger().warn('Unable to retrieve id token for logout', { error });
    return;
  }
};

export const getLogoutUrl = async (provider: string) => {
  const providerConfig = getProviderConfiguration(provider);
  if (!providerConfig) {
    return;
  }

  const issuer = providerConfig.issuer.replace(/\/$/, '');
  const discoveryUrl = `${issuer}/.well-known/openid-configuration`;
  const discovery = await getOpenIdConfiguration(discoveryUrl);
  const endSessionUrl = discovery.end_session_endpoint;
  if (!endSessionUrl) {
    return;
  }

  const idToken = await getIdToken(provider);
  if (!idToken) {
    return;
  }

  const signoutUrl = new URL(endSessionUrl);
  signoutUrl.searchParams.set('id_token_hint', idToken);
  signoutUrl.searchParams.set('post_logout_redirect_uri', process.env.BASE_URL!);
  return signoutUrl.toString();
};
