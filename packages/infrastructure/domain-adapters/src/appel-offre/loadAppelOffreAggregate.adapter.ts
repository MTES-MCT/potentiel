import { LoadAppelOffreAggregatePort } from '@potentiel-domain/appel-offre';
import { appelsOffreData } from '@potentiel-domain/inmemory-referential';
import { Option } from '@potentiel-libraries/monads';

export const loadAppelOffreAggregateAdapter: LoadAppelOffreAggregatePort = (identifiant) => {
  const appelOffre = appelsOffreData.find((ao) => ao.id === identifiant);

  if (!appelOffre) return Promise.resolve(Option.none);

  return Promise.resolve(appelOffre);
};
