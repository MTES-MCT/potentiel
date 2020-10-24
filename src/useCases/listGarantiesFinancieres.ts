import { ProjectRepo, UserRepo } from '../dataAccess'
import { DREAL, Project, User } from '../entities'
import { GarantiesFinancieresListDTO } from '../modules/project/dtos/GarantiesFinancieresList'
import { toGarantiesFinancieresList } from '../modules/project/mappers'

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
  }: CallUseCaseProps): Promise<GarantiesFinancieresListDTO> {
    let projects: Project[]
    let regions: DREAL[]
    switch (user.role) {
      case 'dreal':
        regions = await findDrealsForUser(user.id)
        projects = (
          await findAllProjectsForRegions(regions, {
            garantiesFinancieres: 'submitted',
          })
        ).items
        break
      case 'admin':
      case 'dgec':
        projects = (
          await findAllProjects({
            garantiesFinancieres: 'submitted',
          })
        ).items
        break
      default:
        projects = []
        break
    }

    // TODO: move this to a specific query that returns a GarantiesFinancieresListDTO directly
    return toGarantiesFinancieresList(projects)
  }
}
