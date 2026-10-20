import { DateTime } from '@potentiel-domain/common';
import { getLogger } from '@potentiel-libraries/monitoring';

type WithCacheOptions = {
  cacheTimeInMs: number;
  now?: () => number;
};

type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

export const withCache = <T>(
  fetch: () => Promise<T>,
  { cacheTimeInMs, now = () => DateTime.now().date.getTime() }: WithCacheOptions,
): (() => Promise<T>) => {
  let entry: CacheEntry<T> | undefined;
  let pendingRequest: Promise<T> | undefined;

  const refresh = async (): Promise<T> => {
    try {
      const value = await fetch();
      entry = { value, expiresAt: now() + cacheTimeInMs };
      return value;
    } catch (error) {
      if (entry) {
        getLogger('withCache').warn('Refresh failed, serving stale cache', {
          error: (error as Error).message,
        });
        return entry.value;
      }
      throw error;
    } finally {
      pendingRequest = undefined;
    }
  };

  return () => {
    if (entry && entry.expiresAt > now()) {
      return Promise.resolve(entry.value);
    }

    if (!pendingRequest) {
      pendingRequest = refresh();
    }

    return pendingRequest;
  };
};
