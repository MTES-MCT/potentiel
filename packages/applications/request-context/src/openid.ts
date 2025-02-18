import { BaseClient, Issuer } from 'openid-client';
import { createRemoteJWKSet, KeyLike } from 'jose';
import { match } from 'ts-pattern';

import { getProviderConfiguration } from './constants';

let openIdIssuerPromise: Promise<Issuer<BaseClient>>;
let jwksPromise: Promise<KeyLike>;

const keycloakConfiguration = getProviderConfiguration('keycloak');
const proConnectConfiguration = getProviderConfiguration('proconnect');

const getOpenIdIssuer = (provider: string) => {
  const issuer = match(provider)
    .with('proconnect', () => proConnectConfiguration.issuer)
    .otherwise(() => keycloakConfiguration.issuer);

  if (!openIdIssuerPromise) {
    openIdIssuerPromise = Issuer.discover(issuer);
  }
  return openIdIssuerPromise;
};
export const getOpenIdClient = async (provider: string) => {
  const { Client } = await getOpenIdIssuer(provider);

  if (provider === 'proconnect') {
    return new Client({
      client_id: proConnectConfiguration.clientId,
      client_secret: proConnectConfiguration.clientSecret,
    });
  }

  return new Client({
    client_id: keycloakConfiguration.clientId,
    client_secret: keycloakConfiguration.clientSecret,
  });
};

export const getJwks = async (provider: string) => {
  if (!jwksPromise) {
    const issuer = await getOpenIdIssuer(provider);
    jwksPromise = createRemoteJWKSet(new URL(issuer.metadata.jwks_uri!))({ alg: 'RS256' });
  }
  return jwksPromise;
};
