import { Project, AppelOffre, Periode, Famille, User, DREAL } from '../entities'
import { ProjectRepo, UserRepo } from '../dataAccess'
import { Pagination, PaginatedList } from '../types'
import periode from '../entities/periode'

interface MakeUseCaseProps {
  projectRepo: ProjectRepo
  userRepo: UserRepo
}

interface CallUseCaseProps {
  user: User
  appelOffreId?: AppelOffre['id']
  periodeId?: Periode['id']
  familleId?: Famille['id']
  pagination: Pagination
}

export default function makeListProjects({
  projectRepo,
  userRepo,
}: MakeUseCaseProps) {
  return async function listProjects({
    user,
    appelOffreId,
    periodeId,
    familleId,
    pagination,
  }: CallUseCaseProps): Promise<PaginatedList<Project>> {
    let userDreals: Array<DREAL> = []
    if (user.role === 'dreal') {
      userDreals = await userRepo.findDrealsForUser(user.id)
    }

    const query: any =
      user.role === 'admin'
        ? {
            notifiedOn: -1, // This means > 0
          }
        : user.role === 'dreal'
        ? {
            notifiedOn: -1, // This means > 0
            regionProjet: userDreals,
          }
        : { id: '' } // never

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
