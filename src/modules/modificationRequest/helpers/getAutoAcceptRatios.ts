import { ProjectAppelOffre, Technologie } from '@entities'

const defaultAutoAcceptRatios = { min: 0.9, max: 1.1 }

export const getAutoAcceptRatios = (project: {
  appelOffre?: ProjectAppelOffre
  technologie: Technologie
}): { min: number; max: number } => {
  const { appelOffre, technologie } = project

  if (!appelOffre) {
    return defaultAutoAcceptRatios
  }

  if (appelOffre.changementPuissance.changementByTechnologie) {
    if (technologie === 'N/A') {
      return defaultAutoAcceptRatios
    }

    return appelOffre.changementPuissance.autoAcceptRatios[technologie]
  }

  return appelOffre.changementPuissance.autoAcceptRatios
}
