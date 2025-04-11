import { IRateLimiterOptions, RateLimiterMemory, RateLimiterRes } from 'rate-limiter-flexible';
import { headers } from 'next/headers';

import { getContext } from '@potentiel-applications/request-context';
import { getLogger } from '@potentiel-libraries/monitoring';

/** Permet de limiter le nombre de requêtes par utilisateur et IP */
export function withRateLimit<TResult, TArgs extends unknown[]>(
  action: (...args: TArgs) => Promise<TResult>,
  rateLimiterOptions: IRateLimiterOptions & {
    keyPrefix: string;
    message: string;
    /** Permet d'appliquer le rate limiter à un élement en particulier */
    getKeySuffix?: (...args: TArgs) => Promise<string>;
  },
): (...args: TArgs) => Promise<TResult> {
  const rateLimiter = new RateLimiterMemory(rateLimiterOptions);
  const logger = getLogger(`RateLimit.${rateLimiterOptions.keyPrefix}`);

  return async (...args: TArgs) => {
    const utilisateur = getContext()?.utilisateur;
    const ip = headers().get('x-forwarded-for');
    try {
      const suffix = await rateLimiterOptions.getKeySuffix?.(...args);
      if (utilisateur) {
        await rateLimiter.consume(utilisateur.identifiantUtilisateur.email + suffix);
      }
      if (ip) {
        await rateLimiter.consume(ip + suffix);
      }
      if (!utilisateur && !ip) {
        logger.warn('No user or IP found');
      }
    } catch (error) {
      if (error instanceof RateLimiterRes) {
        logger.warn('Rate limit reached', {
          utilisateur,
          ip,
          keyPrefix: rateLimiterOptions.keyPrefix,
        });
        throw new TooManyRequestsError(rateLimiterOptions.message);
      }
      throw error;
    }
    return await action(...args);
  };
}

export class TooManyRequestsError extends Error {}
