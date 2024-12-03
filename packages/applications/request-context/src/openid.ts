import { BaseClient, Issuer } from 'openid-client';
import { createRemoteJWKSet, KeyLike } from 'jose';

import { clientId, clientSecret, issuerUrl } from './constants';

let openIdIssuerPromise: Promise<Issuer<BaseClient>>;
let jwksPromise: Promise<KeyLike>;

const getOpenIdIssuer = () => {
  if (!openIdIssuerPromise) {
    openIdIssuerPromise = Issuer.discover(issuerUrl);
  }
  return openIdIssuerPromise;
};
export const getOpenIdClient = async () => {
  const { Client } = await getOpenIdIssuer();
  return new Client({ client_id: clientId, client_secret: clientSecret });
};

export const getJwks = async () => {
  if (!jwksPromise) {
    const issuer = await getOpenIdIssuer();
    jwksPromise = createRemoteJWKSet(new URL(issuer.metadata.jwks_uri!))({ alg: 'RS256' });
  }
  return jwksPromise;
};
