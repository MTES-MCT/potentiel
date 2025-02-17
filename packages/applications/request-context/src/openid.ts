import { BaseClient, Issuer } from 'openid-client';
import { createRemoteJWKSet, KeyLike } from 'jose';
import { match } from 'ts-pattern';

import {
  keycloakClientId,
  keycloakClientSecret,
  keycloakIssuerUrl,
  proConnectClientId,
  proConnectClientSecret,
  proConnectIssuerUrl,
} from './constants';

let openIdIssuerPromise: Promise<Issuer<BaseClient>>;
let jwksPromise: Promise<KeyLike>;

const getOpenIdIssuer = (provider: string) => {
  const issuer = match(provider)
    .with('proconnect', () => proConnectIssuerUrl)
    .otherwise(() => keycloakIssuerUrl);

  if (!openIdIssuerPromise) {
    openIdIssuerPromise = Issuer.discover(issuer);
  }
  return openIdIssuerPromise;
};
export const getOpenIdClient = async (provider: string) => {
  const { Client } = await getOpenIdIssuer(provider);

  if (provider === 'proconnect') {
    return new Client({ client_id: proConnectClientId, client_secret: proConnectClientSecret });
  }

  return new Client({ client_id: keycloakClientId, client_secret: keycloakClientSecret });
};

export const getJwks = async (provider: string) => {
  if (!jwksPromise) {
    const issuer = await getOpenIdIssuer(provider);
    jwksPromise = createRemoteJWKSet(new URL(issuer.metadata.jwks_uri!))({ alg: 'RS256' });
  }
  return jwksPromise;
};
