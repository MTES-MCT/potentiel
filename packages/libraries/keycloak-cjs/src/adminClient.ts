import KeycloakAdmin from '@keycloak/keycloak-admin-client';

type GetKeycloakAdminClientProps = {
  serverUrl: string;
  realmName: string;
  clientId: string;
  clientSecret: string;
};

export async function getKeycloakAdminClient({
  clientId,
  clientSecret,
  realmName,
  serverUrl,
}: GetKeycloakAdminClientProps) {
  const keycloakAdmin = new KeycloakAdmin({
    baseUrl: serverUrl,
    realmName,
  });
  await keycloakAdmin.auth({
    grantType: 'client_credentials',
    clientId,
    clientSecret,
  });
  return keycloakAdmin;
}
