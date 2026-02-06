import { Issuer } from 'openid-client';
import { createRemoteJWKSet } from 'jose';
import { getServerSession } from 'next-auth';

import { getProviderConfiguration } from './getProviderConfiguration.js';

export const getOpenIdClient = async (providerOption?: string) => {
  const provider = providerOption ?? (await getCurrentProvider());

  const { Client } = await getOpenIdIssuer(provider);
  const { clientId, clientSecret } = getProviderConfiguration(provider);

  return new Client({
    client_id: clientId,
    client_secret: clientSecret,
  });
};

export const getJwks = async (provider: 'proconnect' | 'keycloak') => {
  const issuer = await getOpenIdIssuer(provider);
  const jwksPromise = createRemoteJWKSet(new URL(issuer.metadata.jwks_uri!))({ alg: 'RS256' });

  return jwksPromise;
};

const getCurrentProvider = async () => {
  const session = await getServerSession({
    callbacks: {
      session({ session, token }) {
        session.provider = token.provider;
        return session;
      },
    },
  });

  return session?.provider ?? 'keycloak';
};

const getOpenIdIssuer = (provider: string) => {
  const { issuer } = getProviderConfiguration(provider);

  const openIdIssuerPromise = Issuer.discover(issuer);
  return openIdIssuerPromise;
};
