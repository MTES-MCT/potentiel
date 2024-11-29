export const issuerUrl = `${process.env.KEYCLOAK_SERVER}/realms/${process.env.KEYCLOAK_REALM}`;

export const clientId = process.env.KEYCLOAK_USER_CLIENT_ID ?? '';
export const clientSecret = process.env.KEYCLOAK_USER_CLIENT_SECRET ?? '';
