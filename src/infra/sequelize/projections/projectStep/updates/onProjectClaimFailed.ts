import { logger } from '../../../../../core/utils'
import { ProjectClaimFailed } from '../../../../../modules/project'

export const onProjectClaimFailed = (models) => async (event: ProjectClaimFailed) => {
  const { UserProjectClaimCounters } = models
  const { claimedBy, projectId } = event.payload

  try {
    const [userProjectClaim, created] = await UserProjectClaimCounters.findOrCreate({
      where: { userId: claimedBy, projectId },
      defaults: { claimTryCounter: 1 },
    })

    if (!created) {
      userProjectClaim.claimTryCounter++
      await userProjectClaim.save()
    }
  } catch (e) {
    logger.error(e)
  }
}
