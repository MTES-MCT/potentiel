import { Nouveautés } from '@potentiel-domain/nouveautes';
import { GristApiClient, withCache } from '@potentiel-infrastructure/grist-api-client';

const TEN_MINUTES_IN_MS = 10 * 60 * 1000;

export const setupNouveautés = () => {
  Nouveautés.registerNouveautésQueries({
    récupérerNouveautés: withCache(GristApiClient.récupérerNouveautés, {
      cacheTimeInMs: TEN_MINUTES_IN_MS,
    }),
  });
};
