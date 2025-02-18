import { BaseClient, Issuer } from 'openid-client';
import { createRemoteJWKSet, KeyLike } from 'jose';

import { getProviderConfiguration } from './getProviderConfiguration';

let openIdIssuerPromise: Promise<Issuer<BaseClient>>;
let jwksPromise: Promise<KeyLike>;

const getOpenIdIssuer = (provider: string) => {
  const { issuer } = getProviderConfiguration(provider);

  if (!openIdIssuerPromise) {
    openIdIssuerPromise = Issuer.discover(issuer);
  }
  return openIdIssuerPromise;
};
export const getOpenIdClient = async (provider: string) => {
  const { Client } = await getOpenIdIssuer(provider);
  const { clientId, clientSecret } = getProviderConfiguration(provider);

  return new Client({
    client_id: clientId,
    client_secret: clientSecret,
  });
};

export const getJwks = async (provider: string) => {
  if (!jwksPromise) {
    const issuer = await getOpenIdIssuer(provider);
    jwksPromise = createRemoteJWKSet(new URL(issuer.metadata.jwks_uri!))({ alg: 'RS256' });
  }
  return jwksPromise;
};
