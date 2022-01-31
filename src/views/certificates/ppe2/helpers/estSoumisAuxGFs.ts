import { ProjectDataForCertificate } from '@modules/project'

export const estSoumisAuxGFs = (project: ProjectDataForCertificate) => {
  const { appelOffre } = project
  const famille = appelOffre.familles.find((famille) => famille.id === project.familleId)

  return (
    appelOffre.id === 'Eolien' ||
    famille?.garantieFinanciereEnMois ||
    famille?.soumisAuxGarantiesFinancieres
  )
}
