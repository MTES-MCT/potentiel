import { z } from 'zod';

const keycloakConfigSchema = z.object({
  KEYCLOAK_SERVER: z.string().url(),
  KEYCLOAK_REALM: z.string(),
  KEYCLOAK_USER_CLIENT_ID: z.string(),
  KEYCLOAK_USER_CLIENT_SECRET: z.string(),
});

const proconnectConfigSchema = z.object({
  PROCONNECT_ISSUER: z.string().url(),
  PROCONNECT_CLIENT_ID: z.string(),
  PROCONNECT_CLIENT_SECRET: z.string(),
});

export function getProviderConfiguration(provider: string) {
  if (provider === 'keycloak') {
    const authConfig = keycloakConfigSchema.parse(process.env);
    return {
      issuer: `${authConfig.KEYCLOAK_SERVER}/realms/${authConfig.KEYCLOAK_REALM}`,
      clientId: authConfig.KEYCLOAK_USER_CLIENT_ID,
      clientSecret: authConfig.KEYCLOAK_USER_CLIENT_SECRET,
    };
  } else if (provider === 'proconnect') {
    const authConfig = proconnectConfigSchema.parse(process.env);
    return {
      issuer: authConfig.PROCONNECT_ISSUER,
      clientId: authConfig.PROCONNECT_CLIENT_ID,
      clientSecret: authConfig.PROCONNECT_CLIENT_SECRET,
    };
  } else {
    throw new Error(`Provider ${provider} not supported`);
  }
}
