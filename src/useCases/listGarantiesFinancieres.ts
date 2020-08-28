import { Project, User, AppelOffre, Periode, Famille } from '../entities'
import { ProjectRepo, UserRepo } from '../dataAccess'
import { Pagination, PaginatedList } from '../types'
import periode from '../entities/periode'

interface MakeUseCaseProps {
  findAllProjectsForRegions: ProjectRepo['findAllForRegions']
  findAllProjects: ProjectRepo['findAll']
  findDrealsForUser: UserRepo['findDrealsForUser']
}

interface CallUseCaseProps {
  user: User
}

export default function makeListGarantiesFinancieres({
  findAllProjectsForRegions,
  findAllProjects,
  findDrealsForUser,
}: MakeUseCaseProps) {
  return async function listGarantiesFinancieres({
    user,
  }: CallUseCaseProps): Promise<Array<Project>> {
    switch (user.role) {
      case 'dreal':
        const regions = await findDrealsForUser(user.id)
        return (
          await findAllProjectsForRegions(regions, {
            garantiesFinancieres: 'submitted',
          })
        ).items
      case 'admin':
      case 'dgec':
        return (
          await findAllProjects({
            garantiesFinancieres: 'submitted',
          })
        ).items
      default:
        return []
    }
  }
}
