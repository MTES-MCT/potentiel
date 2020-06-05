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
    if (user.role === 'porteur-projet') return []

    const query: any = {
      garantiesFinancieresSubmittedOn: -1, // means not 0
    }

    if (user.role === 'dreal') {
      // If dreal user, only show projects for this user's dreals
      query.regionProjet = await userRepo.findDrealsForUser(user.id)
    }

    console.log('listGarantiesFinancieres useCase query', query)

    return projectRepo.findAll(query)
  }
}
