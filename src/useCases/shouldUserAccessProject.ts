import { User, Project, makeUser } from '../entities'
import { UserRepo, ProjectRepo } from '../dataAccess'
import _ from 'lodash'

interface MakeUseCaseProps {
  userRepo: UserRepo
  projectRepo: ProjectRepo
}

interface CallUseCaseProps {
  projectId: Project['id']
  user: User
}

export default function makeShouldUserAccessProject({
  userRepo,
  projectRepo,
}: MakeUseCaseProps) {
  return async function shouldUserAccessProject({
    projectId,
    user,
  }: CallUseCaseProps): Promise<boolean> {
    if (['admin', 'dgec'].includes(user.role)) return true

    if (user.role === 'dreal') {
      const userDreals = await userRepo.findDrealsForUser(user.id)
      const projectRes = await projectRepo.findById(projectId)

      if (projectRes.is_none()) return false

      const project = projectRes.unwrap()
      return userDreals.some((region) => project.regionProjet.includes(region))
    }

    return userRepo.hasProject(user.id, projectId)
  }
}
