const clients = {
  enedis: {
    id: 'integration-grd-enedis',
    secret: 'aWLTypom26xaQEhRjWoraV6GJcuCQRMs',
  },
  edf: {
    id: 'integration-grd-edf',
    secret: '8q53cbrj9tCAOCB7d8S5r6dMcCG02M7t',
  },
};

export const getAccessToken = async (client: keyof typeof clients) => {
  const { id, secret } = clients[client];
  const issuerUrl = `${process.env.KEYCLOAK_SERVER}/realms/${process.env.KEYCLOAK_REALM}`;
  const response = await fetch(`${issuerUrl}/protocol/openid-connect/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: id,
      client_secret: secret,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get token: ${response.status}`);
  }

  const data = (await response.json()) as { access_token: string };
  return data.access_token;
};
