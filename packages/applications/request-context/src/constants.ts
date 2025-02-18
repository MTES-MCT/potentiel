export function getProviderConfiguration(provider: string) {
  if (provider === 'keycloak') {
    const keycloakIssuerUrl = `${process.env.KEYCLOAK_SERVER}/realms/${process.env.KEYCLOAK_REALM}`;
    const keycloakClientId = process.env.KEYCLOAK_USER_CLIENT_ID ?? '';
    const keycloakClientSecret = process.env.KEYCLOAK_USER_CLIENT_SECRET ?? '';

    return {
      issuer: keycloakIssuerUrl,
      clientId: keycloakClientId,
      clientSecret: keycloakClientSecret,
    };
  } else if (provider === 'proconnect') {
    const proConnectIssuerUrl = `${process.env.PROCONNECT_ENDPOINT}/api/v2`;
    const proConnectClientId = process.env.PROCONNECT_CLIENT_ID ?? '';
    const proConnectClientSecret = process.env.PROCONNECT_CLIENT_SECRET ?? '';

    return {
      issuer: proConnectIssuerUrl,
      clientId: proConnectClientId,
      clientSecret: proConnectClientSecret,
    };
  } else {
    throw new Error(`Provider ${provider} not supported`);
  }
}
