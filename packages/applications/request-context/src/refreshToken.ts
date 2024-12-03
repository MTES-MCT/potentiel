import { InvalidOperationError } from '@potentiel-domain/core';

import { getOpenIdClient } from './openid';

export async function refreshAccessToken(refreshToken: string) {
  const client = await getOpenIdClient();
  const refreshedTokens = await client.refresh(refreshToken);
  if (!refreshedTokens.access_token || !refreshedTokens.expires_in) {
    throw new RefreshTokenError();
  }
  return {
    accessToken: refreshedTokens.access_token,
    expiresAt: Date.now() + refreshedTokens.expires_in * 1000,
    refreshToken: refreshedTokens.refresh_token ?? refreshToken,
  };
}

class RefreshTokenError extends InvalidOperationError {
  constructor() {
    super('Refreshing the token failed');
  }
}
