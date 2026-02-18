import { keycloak, KeycloakOptions } from 'better-auth/plugins';

export const customKeycloak = (options: KeycloakOptions) => {
  const keycloakOptions = keycloak(options);
  const mapProfileToUser = (profile: Record<string, string>): Record<string, string> => ({
    ...profile,
    accountUrl: process.env.KEYCLOAK_ACCOUNT?.replace('{{issuer}}', options.issuer) ?? '',
    provider: keycloakOptions.providerId,
  });

  return {
    ...keycloakOptions,
    mapProfileToUser,
  };
};
