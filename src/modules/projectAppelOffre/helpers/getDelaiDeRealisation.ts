import { ProjectAppelOffre } from '@entities'

export const getDelaiDeRealisation = (
  appelOffre: ProjectAppelOffre,
  technologie: string | undefined
): number | null => {
  if (appelOffre.decoupageParTechnologie) {
    if (!isValidTechnologie(technologie)) {
      return null
    }

    return appelOffre.delaiRealisationEnMoisParTechnologie[technologie]
  }

  return appelOffre.delaiRealisationEnMois
}

const isValidTechnologie = (
  technologie: string | undefined
): technologie is 'pv' | 'eolien' | 'hydraulique' => {
  return !!technologie && ['pv', 'eolien', 'hydraulique'].includes(technologie)
}
