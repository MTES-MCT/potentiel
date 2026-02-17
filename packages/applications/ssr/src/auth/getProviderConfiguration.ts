import { match } from 'ts-pattern';

import { ProconnectOptions } from './proconnect.provider';

export const getKeycloakConfiguration = (): ProconnectOptions => ({
  providerId: 'keycloak',
  issuer: `${process.env.KEYCLOAK_SERVER}/realms/${process.env.KEYCLOAK_REALM}`,
  clientId: process.env.KEYCLOAK_USER_CLIENT_ID ?? '',
  clientSecret: process.env.KEYCLOAK_USER_CLIENT_SECRET ?? '',
});

export const getProconnectConfiguration = (): ProconnectOptions => ({
  providerId: 'proconnect',
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

export function getProviderAccountUrl(providerId: string) {
  if (providerId === 'email') {
    return '';
  }
  return match(providerId)
    .with('proconnect', () => process.env.PROCONNECT_ACCOUNT ?? '')
    .with('keycloak', () =>
      (process.env.KEYCLOAK_ACCOUNT ?? '').replace('{{issuer}}', getKeycloakConfiguration().issuer),
    )
    .otherwise(() => undefined);
}
