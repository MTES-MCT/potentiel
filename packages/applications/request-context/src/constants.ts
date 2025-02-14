export const keycloakIssuerUrl = `${process.env.KEYCLOAK_SERVER}/realms/${process.env.KEYCLOAK_REALM}`;
export const keycloakClientId = process.env.KEYCLOAK_USER_CLIENT_ID ?? '';
export const keycloakClientSecret = process.env.KEYCLOAK_USER_CLIENT_SECRET ?? '';

export const proConnectIssuerUrl = `${process.env.PROCONNECT_ENDPOINT}/api/v2`;
export const proConnectClientId = process.env.PROCONNECT_CLIENT_ID ?? '';
export const proConnectClientSecret = process.env.PROCONNECT_CLIENT_SECRET ?? '';
