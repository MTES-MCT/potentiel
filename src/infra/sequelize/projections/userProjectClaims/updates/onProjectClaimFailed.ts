import { logger } from '../../../../../core/utils'
import { ProjectClaimFailed } from '@modules/projectClaim/events'

export const onProjectClaimFailed = (models) => async (event: ProjectClaimFailed) => {
  const { UserProjectClaims } = models
  const { claimedBy, projectId } = event.payload

  try {
    const [userProjectClaim, created] = await UserProjectClaims.findOrCreate({
      where: { userId: claimedBy, projectId },
      defaults: { failedAttempts: 1 },
    })

    if (!created) {
      userProjectClaim.failedAttempts++
      await userProjectClaim.save()
    }
  } catch (e) {
    logger.error(e)
  }
}
