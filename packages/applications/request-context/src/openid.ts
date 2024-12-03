import { EndSessionParameters, Issuer } from 'openid-client';
import { createRemoteJWKSet } from 'jose';

import { clientId, clientSecret, issuerUrl } from './constants';

const openIdIssuerPromise = Issuer.discover(issuerUrl);
const jwks = openIdIssuerPromise.then((issuer) =>
  createRemoteJWKSet(new URL(issuer.metadata.jwks_uri!))({ alg: 'RS256' }),
);

export const getOpenIdClient = async () => {
  const { Client } = await openIdIssuerPromise;
  return new Client({ client_id: clientId, client_secret: clientSecret });
};

export const getLogoutUrl = async (params: EndSessionParameters) => {
  const client = await getOpenIdClient();
  return client.endSessionUrl(params);
};

export const getJwks = async () => jwks;
