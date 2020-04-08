import { Project, makeProject, User } from '../entities'
import { ProjectRepo, UserRepo } from '../dataAccess'
import _ from 'lodash'

interface MakeUseCaseProps {
  projectRepo: ProjectRepo
  userRepo: UserRepo
}

interface CallUseCaseProps {
  user: User
  projectId: Project['id']
}

export default function makeGetUserProject({
  projectRepo,
  userRepo,
}: MakeUseCaseProps) {
  return async function getUserProject({
    user,
    projectId,
  }: CallUseCaseProps): Promise<Project | null> {
    // Check the rights to the project
    if (!['admin', 'dgec'].includes(user.role)) {
      const userHasRightsToProject = await userRepo.hasProject(
        user.id,
        projectId
      )

      if (!userHasRightsToProject) return null
    }

    // Rights are ok, return the project instance
    const projectResult = await projectRepo.findById(projectId)
    if (projectResult.is_none()) return null

    const project = projectResult.unwrap()

    return project
  }
}
