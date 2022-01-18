import { ProjectRepo } from '../dataAccess'
import { Project, User } from '@entities'

interface MakeUseCaseProps {
  findProjectById: ProjectRepo['findById']
  shouldUserAccessProject: (args: { user: User; projectId: Project['id'] }) => Promise<boolean>
}

interface CallUseCaseProps {
  user: User
  projectId: Project['id']
}

export default function makeGetUserProject({
  findProjectById,
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
    const project = await findProjectById(projectId)
    if (!project) return null

    if (user.role === 'porteur-projet' && !project.notifiedOn) return null

    return project
  }
}
