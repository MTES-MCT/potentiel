import { JWT } from 'next-auth/jwt';

import { InvalidOperationError } from '@potentiel-domain/core';
import { getLogger } from '@potentiel-libraries/monitoring';

import { getOpenIdClient } from './openid';

const logger = getLogger('Auth');

export async function refreshToken(token: JWT): Promise<JWT> {
  const { sub, provider = '', expiresAt } = token;

  if (expiresAt && isTokenUpToDate(expiresAt)) {
    return token;
  }

  logger.debug(`Token expired`, { sub });

  if (!token.refreshToken) {
    logger.warn(`no refreshToken available`, { sub });
    return token;
  }

  try {
    const { expiresAt, refreshToken } = await refreshAccessToken(token.refreshToken, provider);

    logger.debug(`Token refreshed`, { sub, expiresAt: new Date(expiresAt) });

    return {
      ...token,
      expiresAt,
      refreshToken,
    };
  } catch (e) {
    const err = e as { error?: string; error_description?: string };
    if (err?.error === 'invalid_grant') {
      logger.warn(`Failed to refresh token (invalid_grant): ${err.error_description}`);
    } else {
      logger.error(new Error('Failed to refresh token', { cause: (e as Error).message }));
    }
  }

  return token;
}

function isTokenUpToDate(expiresAt: number) {
  return expiresAt > Date.now();
}

async function refreshAccessToken(refreshToken: string, provider: string) {
  const client = await getOpenIdClient(provider);
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
