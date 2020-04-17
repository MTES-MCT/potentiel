import { Project, AppelOffre, Periode } from '../entities'
import { ProjectRepo } from '../dataAccess'
import periode from '../entities/periode'

interface MakeUseCaseProps {
  projectRepo: ProjectRepo
}

interface CallUseCaseProps {
  appelOffreId?: AppelOffre['id']
  periodeId?: Periode['id']
}

export default function makeListProjects({ projectRepo }: MakeUseCaseProps) {
  return async function listProjects({
    appelOffreId,
    periodeId,
  }: CallUseCaseProps): Promise<Array<Project>> {
    const query: any = {}

    if (appelOffreId) {
      query.appelOffreId = appelOffreId

      if (periodeId) {
        query.periodeId = periodeId
      }
    }

    return projectRepo.findAll(query, false)
  }
}
