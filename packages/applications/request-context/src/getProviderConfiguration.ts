import { authConfig } from './authConfig';

export function getProviderConfiguration(provider: string) {
  if (provider === 'keycloak') {
    return {
      issuer: `${authConfig.KEYCLOAK_SERVER}/realms/${authConfig.KEYCLOAK_REALM}`,
      clientId: authConfig.KEYCLOAK_USER_CLIENT_ID,
      clientSecret: authConfig.KEYCLOAK_USER_CLIENT_SECRET,
    };
  } else if (provider === 'proconnect') {
    return {
      issuer: authConfig.PROCONNECT_ISSUER,
      clientId: authConfig.PROCONNECT_CLIENT_ID,
      clientSecret: authConfig.PROCONNECT_CLIENT_SECRET,
    };
  } else {
    throw new Error(`Provider ${provider} not supported`);
  }
}
