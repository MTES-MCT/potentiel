import { ProjectAppelOffre } from '@entities'

export const isSoumisAuxGFs = (projectAppelOffre: ProjectAppelOffre): boolean => {
  if (projectAppelOffre.soumisAuxGarantiesFinancieres) {
    return true
  }

  const { famille } = projectAppelOffre

  if (famille) {
    const { soumisAuxGarantiesFinancieres, garantieFinanciereEnMois = 0 } = famille
    return soumisAuxGarantiesFinancieres === true || garantieFinanciereEnMois > 0
  }

  return false
}
