import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Candidature } from '@potentiel-domain/projet';

export const getDelaiDeRealisation = (
  appelOffre: AppelOffre.AppelOffreReadModel,
  technologie: Candidature.TypeTechnologie.RawType,
): number | null => {
  if (appelOffre.decoupageParTechnologie) {
    if (technologie === 'N/A') {
      return null;
    }

    return appelOffre.delaiRealisationEnMoisParTechnologie[technologie];
  }

  return appelOffre.delaiRealisationEnMois;
};
