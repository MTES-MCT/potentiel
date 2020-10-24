import { appelsOffreStatic } from '../../dataAccess/inMemory'
import { Project } from '../../entities'

export default function addAppelOffreToProject(project: Project) {
  project.appelOffre = appelsOffreStatic.find(
    (appelOffre) => appelOffre.id === project.appelOffreId
  )

  if (!project.appelOffre) return

  project.appelOffre.periode = project.appelOffre.periodes.find(
    (periode) => periode.id === project.periodeId
  )

  project.famille = project.appelOffre.familles.find((famille) => famille.id === project.familleId)
}
