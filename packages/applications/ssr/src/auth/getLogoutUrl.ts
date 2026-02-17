import { LastLoginMethodOptions } from 'better-auth/plugins';
import { cookies, headers } from 'next/headers';

import { getLogger } from '@potentiel-libraries/monitoring';

import { auth } from '.';

import { getProviderConfiguration } from './getProviderConfiguration';
import { getOpenIdConfiguration } from './discovery';

// TODO fix for magic link
// retrieve current provider, using last-login-method plugin.
const getCurrentProvider = () => {
  const lastLoginMethodPlugin = auth.options.plugins.find((x) => x.id === 'last-login-method');
  if (!lastLoginMethodPlugin) {
    return;
  }

  const options = lastLoginMethodPlugin.options as LastLoginMethodOptions;
  const lastUsedProvider = cookies().get(
    options?.cookieName ?? 'better-auth.last_used_login_method',
  )?.value;

  return lastUsedProvider;
};

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

export const getLogoutUrl = async () => {
  const currentProvider = getCurrentProvider();
  if (!currentProvider) {
    return;
  }
  const providerConfig = getProviderConfiguration(currentProvider);
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

  const idToken = await getIdToken(currentProvider);
  if (!idToken) {
    return;
  }

  const signoutUrl = new URL(endSessionUrl);
  signoutUrl.searchParams.set('id_token_hint', idToken);
  signoutUrl.searchParams.set('post_logout_redirect_uri', process.env.BASE_URL!);
  return signoutUrl.toString();
};
