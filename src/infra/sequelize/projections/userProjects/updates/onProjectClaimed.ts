import { logger } from '../../../../../core/utils'
import { ProjectClaimed, ProjectClaimedByOwner } from '../../../../../modules/projectClaim/events'

export const onProjectClaimed = (models) => async (
  event: ProjectClaimed | ProjectClaimedByOwner
) => {
  const { projectId, claimedBy, claimerEmail } = event.payload
  const { UserProjects, Project } = models

  try {
    await Promise.all([
      Project.update({ email: claimerEmail }, { where: { id: projectId } }),
      UserProjects.create({ userId: claimedBy, projectId }),
    ])
  } catch (e) {
    logger.error(e)
  }
}
