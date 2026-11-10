import { Nouveautés } from '@potentiel-domain/nouveautes';
import { GristApiClient } from '@potentiel-infrastructure/grist-api-client';

export const setupNouveautés = () => {
  Nouveautés.registerNouveautésQueries({
    récupérerNouveautés: GristApiClient.récupérerNouveautés,
  });
};
