import { Project, User, AppelOffre, Periode, Famille } from '../entities'
import { ProjectRepo, UserRepo } from '../dataAccess'
import { Pagination, PaginatedList } from '../types'
import periode from '../entities/periode'

interface MakeUseCaseProps {
  projectRepo: ProjectRepo
  userRepo: UserRepo
}

interface CallUseCaseProps {
  user: User
}

export default function makeListGarantiesFinancieres({
  projectRepo,
  userRepo,
}: MakeUseCaseProps) {
  return async function listGarantiesFinancieres({
    user,
  }: CallUseCaseProps): Promise<Array<Project>> {
    switch (user.role) {
      case 'dreal':
        const regions = await userRepo.findDrealsForUser(user.id)
        return (
          await projectRepo.findAllForRegions(
            regions,
            { page: 0, pageSize: 1000 },
            {
              hasGarantiesFinancieres: true,
            }
          )
        ).items
      case 'admin':
      case 'dgec':
        return projectRepo.findAll({
          hasGarantiesFinancieres: true,
        })
      default:
        return []
    }
  }
}
