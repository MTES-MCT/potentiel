import { Project, AppelOffre, Periode, Famille } from '../entities'
import { ProjectRepo } from '../dataAccess'
import { Pagination, PaginatedList } from '../types'
import periode from '../entities/periode'

interface MakeUseCaseProps {
  projectRepo: ProjectRepo
}

interface CallUseCaseProps {
  appelOffreId?: AppelOffre['id']
  periodeId?: Periode['id']
  familleId?: Famille['id']
  pagination: Pagination
}

export default function makeListProjects({ projectRepo }: MakeUseCaseProps) {
  return async function listProjects({
    appelOffreId,
    periodeId,
    familleId,
    pagination,
  }: CallUseCaseProps): Promise<PaginatedList<Project>> {
    const query: any = {
      notifiedOn: -1, // This means > 0
    }

    if (appelOffreId) {
      query.appelOffreId = appelOffreId

      if (periodeId) {
        query.periodeId = periodeId
      }

      if (familleId) {
        query.familleId = familleId
      }
    }

    return projectRepo.findAll(query, pagination)
  }
}
