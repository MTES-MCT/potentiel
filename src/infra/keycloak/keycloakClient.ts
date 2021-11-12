import KeycloakAdmin from 'keycloak-admin'

const { KEYCLOAK_SERVER, KEYCLOAK_REALM } = process.env

export const keycloakAdminClient = new KeycloakAdmin({
  baseUrl: KEYCLOAK_SERVER,
  realmName: KEYCLOAK_REALM,
})
