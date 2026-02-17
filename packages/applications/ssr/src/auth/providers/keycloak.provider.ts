import { User } from 'better-auth';
import { keycloak, KeycloakOptions } from 'better-auth/plugins';

export const customKeycloak = (options: KeycloakOptions) => {
  const mapProfileToUser = (
    profile: Record<string, string>,
  ): Partial<User> & { accountUrl: string } => ({
    ...profile,
    accountUrl: process.env.PROCONNECT_ACCOUNT!,
  });

  return {
    ...keycloak(options),
    mapProfileToUser,
  };
};
