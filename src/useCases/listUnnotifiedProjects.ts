import { Project, AppelOffre, Periode } from '../entities'
import { ProjectRepo } from '../dataAccess'

interface MakeUseCaseProps {
  projectRepo: ProjectRepo
}

interface CallUseCaseProps {
  appelOffreId: AppelOffre['id']
  periodeId: Periode['id']
}

export default function makeListUnnotifiedProjects({
  projectRepo,
}: MakeUseCaseProps) {
  return async function listUnnotifiedProjects({
    appelOffreId,
    periodeId,
  }: CallUseCaseProps): Promise<Array<Project>> {
    console.log('listUnnotifiedProjets', appelOffreId, periodeId)
    return projectRepo.findAll({
      appelOffreId,
      periodeId,
      notifiedOn: 0,
    })
  }
}
