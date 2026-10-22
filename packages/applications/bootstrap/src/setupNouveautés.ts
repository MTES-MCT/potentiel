import { Nouveautés } from '@potentiel-domain/nouveautes';
import { GristApiClient, withCache } from '@potentiel-infrastructure/grist-api-client';

const DEFAULT_NEWS_CACHE_TIME_IN_MIN = 5;

const getNewsCacheTimeInMs = () => {
  const { NEWS_CACHE_TIME_IN_MIN } = process.env;

  const cacheTimeInMin =
    NEWS_CACHE_TIME_IN_MIN && Number(NEWS_CACHE_TIME_IN_MIN) > 0
      ? Number(NEWS_CACHE_TIME_IN_MIN)
      : DEFAULT_NEWS_CACHE_TIME_IN_MIN;

  return cacheTimeInMin * 60 * 1000;
};

export const setupNouveautés = () => {
  Nouveautés.registerNouveautésQueries({
    récupérerNouveautés: withCache(GristApiClient.récupérerNouveautés, {
      cacheTimeInMs: getNewsCacheTimeInMs(),
    }),
  });
};
