import { ProjectDataForCertificate } from '@modules/project'

export const estSoumisAuxGFs = (project: ProjectDataForCertificate): boolean => {
  const { appelOffre } = project
  if (appelOffre.soumisAuxGarantiesFinancieres) {
    return true
  }

  const famille = appelOffre.familles.find((famille) => famille.id === project.familleId)

  if (famille) {
    const { soumisAuxGarantiesFinancieres, garantieFinanciereEnMois = 0 } = famille
    return soumisAuxGarantiesFinancieres === true || garantieFinanciereEnMois > 0
  }

  return false
}
