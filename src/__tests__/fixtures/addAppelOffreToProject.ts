import { appelsOffreStatic } from '@dataAccess/inMemory'
import { Project, ProjectAppelOffre } from '@entities'

export default function addAppelOffreToProject(project: Project) {
  project.appelOffre = appelsOffreStatic.find(
    (appelOffre) => appelOffre.id === project.appelOffreId
  ) as ProjectAppelOffre

  if (!project.appelOffre) return

  const periode = project.appelOffre.periodes.find((periode) => periode.id === project.periodeId)
  if (periode) project.appelOffre.periode = periode

  project.famille = project.appelOffre.familles.find((famille) => famille.id === project.familleId)
}
