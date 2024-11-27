import { clientId, clientSecret, issuerUrl } from './constants';

export async function refreshAccessToken(refreshToken: string) {
  const url = new URL(`${issuerUrl}/protocol/openid-connect/token`);
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });
  const response = await fetch(url.toString(), {
    body: body.toString(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
  });

  const refreshedTokens = await response.json();

  if (!response.ok) {
    throw refreshedTokens;
  }

  return {
    accessToken: refreshedTokens.access_token,
    expiresAt: Date.now() + refreshedTokens.expires_in * 1000,
    refreshToken: refreshedTokens.refresh_token ?? refreshToken,
  };
}
