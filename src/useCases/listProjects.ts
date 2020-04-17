import { Project, AppelOffre, Periode } from '../entities'
import { ProjectRepo } from '../dataAccess'
import { Pagination, PaginatedList } from '../types'
import periode from '../entities/periode'

interface MakeUseCaseProps {
  projectRepo: ProjectRepo
}

interface CallUseCaseProps {
  appelOffreId?: AppelOffre['id']
  periodeId?: Periode['id']
  pagination: Pagination
}

export default function makeListProjects({ projectRepo }: MakeUseCaseProps) {
  return async function listProjects({
    appelOffreId,
    periodeId,
    pagination,
  }: CallUseCaseProps): Promise<PaginatedList<Project>> {
    const query: any = {}

    if (appelOffreId) {
      query.appelOffreId = appelOffreId

      if (periodeId) {
        query.periodeId = periodeId
      }
    }

    return projectRepo.findAll(query, pagination)
  }
}
