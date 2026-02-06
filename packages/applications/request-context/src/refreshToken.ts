import { JWT } from 'next-auth/jwt';

import { InvalidOperationError } from '@potentiel-domain/core';
import { getLogger } from '@potentiel-libraries/monitoring';

import { getOpenIdClient } from './openid.js';

export async function refreshToken(token: JWT): Promise<JWT> {
  const logger = getLogger('Auth');

  const { sub, provider = '', expiresAt } = token;

  if (expiresAt && isTokenUpToDate(expiresAt)) {
    return token;
  }

  logger.debug(`Token expired`, { sub });

  if (!token.refreshToken) {
    logger.warn(`no refreshToken available`, { sub });
    return {};
  }

  try {
    const { refreshToken } = token;
    const client = await getOpenIdClient(provider);
    const refreshedTokens = await client.refresh(refreshToken);
    if (!refreshedTokens.access_token || !refreshedTokens.expires_in) {
      throw new RefreshTokenError();
    }

    const expiresAt = Date.now() + refreshedTokens.expires_in * 1000;
    logger.debug(`Token refreshed`, { sub, expiresAt: new Date(expiresAt) });

    return {
      ...token,
      expiresAt,
      refreshToken: refreshedTokens.refresh_token ?? refreshToken,
    };
  } catch (e) {
    const err = e as { error?: string; error_description?: string };
    if (err?.error === 'invalid_grant') {
      logger.warn(`Failed to refresh token (invalid_grant): ${err.error_description}`);
    } else {
      logger.error(new Error('Failed to refresh token', { cause: (e as Error).message }));
    }

    return {};
  }
}

function isTokenUpToDate(expiresAt: number) {
  return expiresAt > Date.now();
}

class RefreshTokenError extends InvalidOperationError {
  constructor() {
    super('Refreshing the token failed');
  }
}
