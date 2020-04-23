import { ProjectRepo } from '../dataAccess'
import { Project, User } from '../entities'

interface MakeUseCaseProps {
  projectRepo: ProjectRepo
}

interface CallUseCaseProps {
  userId: User['id']
}

export default function makeListUserProjects({
  projectRepo,
}: MakeUseCaseProps) {
  return async function listUserProjects({
    userId,
  }: CallUseCaseProps): Promise<Array<Project>> {
    return projectRepo.findByUser(userId, true)
  }
}
