import { createRemoteJWKSet } from 'jose';

// TODO handle cache

type OpenIdConfiguration = {
  jwks_uri?: string;
  userinfo_endpoint?: string;
  end_session_endpoint?: string;
};

export const getOpenIdConfiguration = async (discoveryUrl: string) => {
  const response = await fetch(discoveryUrl, { method: 'GET' });
  if (!response.ok) {
    throw new Error('Unable to fetch OpenID configuration for Proconnect');
  }
  return response.json() as Promise<OpenIdConfiguration>;
};

export const getJWKS = async (discoveryUrl: string) => {
  const discovery = await getOpenIdConfiguration(discoveryUrl);
  const jwksUrl = discovery.jwks_uri ?? new URL('/jwks', discoveryUrl).toString();
  return createRemoteJWKSet(new URL(jwksUrl));
};
