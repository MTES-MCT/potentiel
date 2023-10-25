import { ProjectAppelOffre } from '../../../entities';
import { AppelOffreReadModel, Technologie } from '@potentiel/domain-views';

export const getDelaiDeRealisation = (
  appelOffre: ProjectAppelOffre | AppelOffreReadModel,
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
