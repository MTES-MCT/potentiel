import KeycloakAdmin from 'keycloak-admin'

let keycloakAdmin: KeycloakAdmin | undefined = undefined

const makeKeycloakClient = (): KeycloakAdmin => {
  if (!keycloakAdmin) {
    const { KEYCLOAK_SERVER, KEYCLOAK_REALM } = process.env
    console.log(`KEYCLOAK ENV VARS : ${KEYCLOAK_SERVER} and ${KEYCLOAK_REALM}`)

    keycloakAdmin = new KeycloakAdmin({
      baseUrl: KEYCLOAK_SERVER,
      realmName: KEYCLOAK_REALM,
    })
  }

  return keycloakAdmin
}

export { makeKeycloakClient }
