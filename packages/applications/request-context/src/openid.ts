import { BaseClient, Issuer } from 'openid-client';
import { createRemoteJWKSet, KeyLike } from 'jose';
import { getServerSession } from 'next-auth';

import { getProviderConfiguration } from './getProviderConfiguration';

let openIdIssuerPromise: Promise<Issuer<BaseClient>>;
let jwksPromise: Promise<KeyLike>;

export const getOpenIdClient = async (provider?: string) => {
  if (!provider) {
    provider = await getCurrentProvider();
  }

  const { Client } = await getOpenIdIssuer(provider);
  const { clientId, clientSecret } = getProviderConfiguration(provider);

  return new Client({
    client_id: clientId,
    client_secret: clientSecret,
  });
};

export const getJwks = async (provider: 'proconnect' | 'keycloak') => {
  if (!jwksPromise) {
    const issuer = await getOpenIdIssuer(provider);
    jwksPromise = createRemoteJWKSet(new URL(issuer.metadata.jwks_uri!))({ alg: 'RS256' });
  }
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

  if (!openIdIssuerPromise) {
    openIdIssuerPromise = Issuer.discover(issuer);
  }
  return openIdIssuerPromise;
};
