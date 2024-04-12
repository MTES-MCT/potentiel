import { KeycloakAdmin } from '@potentiel-librairies/keycloak-cjs';

let keycloakAdmin: KeycloakAdmin | undefined = undefined;

const makeKeycloakClient = (): KeycloakAdmin => {
  if (!keycloakAdmin) {
    const { KEYCLOAK_SERVER, KEYCLOAK_REALM } = process.env;

    keycloakAdmin = new KeycloakAdmin({
      baseUrl: KEYCLOAK_SERVER,
      realmName: KEYCLOAK_REALM,
    });
  }

  return keycloakAdmin;
};

export { makeKeycloakClient };
