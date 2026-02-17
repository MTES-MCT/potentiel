import { match } from 'ts-pattern';
import { KeycloakOptions } from 'better-auth/plugins';

import { ProconnectOptions } from './proconnect.provider';

export const getKeycloakConfiguration = (): KeycloakOptions => ({
  issuer: `${process.env.KEYCLOAK_SERVER}/realms/${process.env.KEYCLOAK_REALM}`,
  clientId: process.env.KEYCLOAK_USER_CLIENT_ID ?? '',
  clientSecret: process.env.KEYCLOAK_USER_CLIENT_SECRET ?? '',
});

export const getProconnectConfiguration = (): ProconnectOptions => ({
  issuer: process.env.PROCONNECT_ISSUER ?? '',
  clientId: process.env.PROCONNECT_CLIENT_ID ?? '',
  clientSecret: process.env.PROCONNECT_CLIENT_SECRET ?? '',
  scopes: ['openid', 'uid', 'given_name', 'usual_name', 'email', 'siret', 'offline_access'],
});

export const getProviderConfiguration = (providerId: string) =>
  match(providerId)
    .with('proconnect', getProconnectConfiguration)
    .with('keycloak', getKeycloakConfiguration)
    .otherwise(() => undefined);
