import { ProjectAppelOffre, Technologie } from '@entities'

export const getDelaiDeRealisation = (
  appelOffre: ProjectAppelOffre,
  technologie: Technologie
): number | null => {
  if (appelOffre.decoupageParTechnologie) {
    if (technologie === 'N/A') {
      return null
    }

    return appelOffre.delaiRealisationEnMoisParTechnologie[technologie]
  }

  return appelOffre.delaiRealisationEnMois
}
