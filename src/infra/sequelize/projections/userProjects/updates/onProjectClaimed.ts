import { logger } from '../../../../../core/utils'
import { ProjectClaimed, ProjectClaimedByOwner } from '@modules/projectClaim/events'

export const onProjectClaimed = (models) => async (
  event: ProjectClaimed | ProjectClaimedByOwner
) => {
  const { projectId, claimedBy } = event.payload
  const { UserProjects } = models

  try {
    await UserProjects.create({ userId: claimedBy, projectId })
  } catch (e) {
    logger.error(e)
  }
}
