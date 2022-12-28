import { ProjectAppelOffre, Technologie } from '@entities'

const defaultRatios = { min: 0.9, max: 1.1 }

export const getRatiosChangementPuissance = (project: {
  appelOffre?: ProjectAppelOffre
  technologie: Technologie
}): { min: number; max: number } => {
  const { appelOffre, technologie } = project

  if (!appelOffre) {
    return defaultRatios
  }

  const { changementPuissance } = appelOffre

  if (changementPuissance.changementByTechnologie) {
    if (technologie === 'N/A') {
      return defaultRatios
    }

    return changementPuissance.ratios[technologie]
  }

  return changementPuissance.ratios
}
