import { Project, makeProject, User } from '../entities'
import { ProjectRepo, UserRepo } from '../dataAccess'
import _ from 'lodash'

interface MakeUseCaseProps {
  projectRepo: ProjectRepo
  shouldUserAccessProject: (args: {
    user: User
    projectId: Project['id']
  }) => Promise<boolean>
}

interface CallUseCaseProps {
  user: User
  projectId: Project['id']
}

export default function makeGetUserProject({
  projectRepo,
  shouldUserAccessProject,
}: MakeUseCaseProps) {
  return async function getUserProject({
    user,
    projectId,
  }: CallUseCaseProps): Promise<Project | null> {
    // Check the rights to the project
    const userHasRightsToProject = await shouldUserAccessProject({
      user,
      projectId,
    })
    if (!userHasRightsToProject) return null

    // Rights are ok, return the project instance
    const projectResult = await projectRepo.findById(projectId)
    if (projectResult.is_none()) return null

    const project = projectResult.unwrap()

    return project
  }
}
