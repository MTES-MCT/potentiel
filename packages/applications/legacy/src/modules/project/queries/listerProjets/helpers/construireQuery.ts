import { ProjectFilters } from '../../../../../dataAccess';
import { AppelOffre } from '@potentiel-domain/appel-offre';

export type FiltresConstruireQuery = {
  appelOffreId?: AppelOffre.AppelOffreReadModel['id'];
  periodeId?: AppelOffre.Periode['id'];
  familleId?: AppelOffre.Famille['id'];
  classement?: 'classés' | 'éliminés' | 'abandons';
  reclames?: 'réclamés' | 'non-réclamés';
};

export const construireQuery = (filtres: FiltresConstruireQuery) => {
  const query: ProjectFilters = {
    isNotified: true,
  };

  if (filtres.appelOffreId) {
    query.appelOffreId = filtres.appelOffreId;

    if (filtres.periodeId) {
      query.periodeId = filtres.periodeId;
    }

    if (filtres.familleId) {
      query.familleId = filtres.familleId;
    }
  }

  switch (filtres.classement) {
    case 'classés':
      query.isClasse = true;
      query.isAbandoned = false;
      break;
    case 'éliminés':
      query.isClasse = false;
      query.isAbandoned = false;
      break;
    case 'abandons':
      query.isAbandoned = true;
      break;
  }

  if (filtres.reclames) {
    query.isClaimed = filtres.reclames === 'réclamés';
  }

  return query;
};
