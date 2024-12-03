import { BaseClient, Issuer } from 'openid-client';
import { createRemoteJWKSet, KeyLike } from 'jose';

import { clientId, clientSecret, issuerUrl } from './constants';

let openIdIssuerPromise: Promise<Issuer<BaseClient>>;
let jwksPromise: Promise<KeyLike>;

export const getOpenIdClient = async () => {
  if (!openIdIssuerPromise) {
    openIdIssuerPromise = Issuer.discover(issuerUrl);
  }
  const { Client } = await openIdIssuerPromise;
  return new Client({ client_id: clientId, client_secret: clientSecret });
};

export const getJwks = async () => {
  if (!jwksPromise) {
    jwksPromise = openIdIssuerPromise.then((issuer) =>
      createRemoteJWKSet(new URL(issuer.metadata.jwks_uri!))({ alg: 'RS256' }),
    );
  }
  return jwksPromise;
};
