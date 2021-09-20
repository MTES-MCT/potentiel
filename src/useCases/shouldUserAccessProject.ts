import { User, Project } from '../entities'
import { UserRepo, ProjectRepo } from '../dataAccess'

interface MakeUseCaseProps {
  userRepo: UserRepo
  findProjectById: ProjectRepo['findById']
}

interface CallUseCaseProps {
  projectId: Project['id']
  user: User
}

export default function makeShouldUserAccessProject({
  userRepo,
  findProjectById,
}: MakeUseCaseProps) {
  return async function shouldUserAccessProject({
    projectId,
    user,
  }: CallUseCaseProps): Promise<boolean> {
    if (['admin', 'dgec', 'acheteur-obligé', 'ademe'].includes(user.role)) return true

    if (user.role === 'dreal') {
      const userDreals = await userRepo.findDrealsForUser(user.id)
      const project = await findProjectById(projectId)

      if (!project) return false

      return userDreals.some((region) => project.regionProjet.includes(region))
    }

    return userRepo.hasProject(user.id, projectId)
  }
}
