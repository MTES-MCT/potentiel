import * as client from 'openid-client';

type GetAccessTokenProps = {
  issuerUrl: string;
  clientId: string;
  clientSecret: string;
};

export const getAccessToken = async ({
  clientId,
  clientSecret,
  issuerUrl,
}: GetAccessTokenProps) => {
  const options = issuerUrl.match(/http:\/\/localhost/)
    ? { execute: [client.allowInsecureRequests] }
    : {};
  const config = await client.discovery(
    new URL(issuerUrl),
    clientId,
    clientSecret,
    undefined,
    options,
  );

  const tokens = await client.clientCredentialsGrant(config, {});
  return tokens.access_token;
};
