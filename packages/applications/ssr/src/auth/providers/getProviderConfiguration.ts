import { match } from 'ts-pattern';
import { KeycloakOptions } from 'better-auth/plugins';

import { ProconnectOptions } from './proconnect.provider';

export const getKeycloakConfiguration = () =>
  ({
    issuer: `${process.env.KEYCLOAK_ISSUER}`,
    clientId: process.env.KEYCLOAK_USER_CLIENT_ID ?? '',
    clientSecret: process.env.KEYCLOAK_USER_CLIENT_SECRET ?? '',
    accountUrl: `${process.env.KEYCLOAK_ISSUER}/account`,
  }) satisfies KeycloakOptions & { accountUrl: string };

export const getProconnectConfiguration = () =>
  ({
    issuer: process.env.PROCONNECT_ISSUER ?? '',
    clientId: process.env.PROCONNECT_CLIENT_ID ?? '',
    clientSecret: process.env.PROCONNECT_CLIENT_SECRET ?? '',
    scopes: ['openid', 'uid', 'given_name', 'usual_name', 'email', 'siret', 'offline_access'],
    accountUrl: process.env.PROCONNECT_ACCOUNT ?? '',
  }) satisfies ProconnectOptions & { accountUrl: string };

export const getProviderConfiguration = (providerId: string) =>
  match(providerId)
    .with('proconnect', getProconnectConfiguration)
    .with('keycloak', getKeycloakConfiguration)
    .otherwise(() => undefined);
