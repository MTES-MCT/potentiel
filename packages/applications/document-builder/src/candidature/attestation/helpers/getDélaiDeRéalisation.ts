import { AppelOffre } from '@potentiel-domain/appel-offre';

export const getDelaiDeRealisation = (
  appelOffre: AppelOffre.AppelOffreReadModel,
  technologie: AppelOffre.Technologie,
): number | null => {
  if (appelOffre.decoupageParTechnologie) {
    if (technologie === 'N/A') {
      return null;
    }

    return appelOffre.delaiRealisationEnMoisParTechnologie[technologie];
  }

  return appelOffre.delaiRealisationEnMois;
};
