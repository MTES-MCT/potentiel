import { ProjectAppelOffre } from '../../../entities';
import { AppelOffre, Technologie } from '@potentiel-domain/appel-offre';

export const getDelaiDeRealisation = (
  appelOffre: ProjectAppelOffre | AppelOffre,
  technologie: Technologie,
): number | null => {
  if (appelOffre.decoupageParTechnologie) {
    if (technologie === 'N/A') {
      return null;
    }

    return appelOffre.delaiRealisationEnMoisParTechnologie[technologie];
  }

  return appelOffre.delaiRealisationEnMois;
};
