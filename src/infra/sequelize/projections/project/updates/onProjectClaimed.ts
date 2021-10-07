import { logger } from '../../../../../core/utils'
import { ProjectClaimed, ProjectClaimedByOwner } from '../../../../../modules/projectClaim/events'

export const onProjectClaimed = (models) => async (
  event: ProjectClaimed | ProjectClaimedByOwner
) => {
  const { projectId, claimerEmail } = event.payload
  const { Project } = models

  try {
    await Project.update({ email: claimerEmail }, { where: { id: projectId } })
  } catch (e) {
    logger.error(e)
  }
}
