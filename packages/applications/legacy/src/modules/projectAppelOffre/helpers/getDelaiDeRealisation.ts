import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Candidature } from '@potentiel-domain/projet';

export const getDelaiDeRealisation = (
  appelOffre: AppelOffre.AppelOffreReadModel,
  technologie: Candidature.TypeTechnologie.RawType,
): number | null => {
  if (appelOffre.multiplesTechnologies) {
    if (technologie === 'N/A') {
      return null;
    }

    return appelOffre.délaiRéalisationEnMois[technologie];
  }

  return appelOffre.délaiRéalisationEnMois;
};
