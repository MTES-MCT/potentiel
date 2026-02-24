import { createRemoteJWKSet } from 'jose';

type OpenIdConfiguration = {
  jwks_uri?: string;
  userinfo_endpoint?: string;
  end_session_endpoint?: string;
};

const cachedDiscovery: Record<string, OpenIdConfiguration> = {};
export const getOpenIdConfiguration = async (discoveryUrl: string) => {
  if (!cachedDiscovery[discoveryUrl]) {
    const response = await fetch(discoveryUrl, { method: 'GET' });
    if (!response.ok) {
      throw new Error('Unable to fetch OpenID configuration for Proconnect');
    }
    cachedDiscovery[discoveryUrl] = await response.json();
  }
  return cachedDiscovery[discoveryUrl];
};

const remoteJWKSets: Record<string, ReturnType<typeof createRemoteJWKSet>> = {};
export const getJWKS = async (discoveryUrl: string) => {
  if (!remoteJWKSets[discoveryUrl]) {
    const discovery = await getOpenIdConfiguration(discoveryUrl);
    const jwksUrl = discovery.jwks_uri ?? new URL('/jwks', discoveryUrl).toString();
    remoteJWKSets[discoveryUrl] = createRemoteJWKSet(new URL(jwksUrl));
  }
  return remoteJWKSets[discoveryUrl];
};
