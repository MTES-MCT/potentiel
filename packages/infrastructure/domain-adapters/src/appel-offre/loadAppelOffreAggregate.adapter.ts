import { LoadAppelOffreAggregatePort } from '@potentiel-domain/appel-offre';
import { appelsOffreData } from '@potentiel-domain/inmemory-referential';

export const loadAppelOffreAggregateAdapter: LoadAppelOffreAggregatePort = (identifiant) => {
  const appelOffre = appelsOffreData.find((ao) => ao.id === identifiant);

  if (!appelOffre) return Promise.reject(new AppelOffreNonTrouvéeError());

  return Promise.resolve(appelOffre);
};

class AppelOffreNonTrouvéeError extends Error {
  constructor() {
    super(`L'appel d'offre n'existe pas`);
  }
}
