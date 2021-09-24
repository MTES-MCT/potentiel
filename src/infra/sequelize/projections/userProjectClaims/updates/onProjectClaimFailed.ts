import { logger } from '../../../../../core/utils'
import { ProjectClaimFailed } from '../../../../../modules/projectClaim/events'

export const onProjectClaimFailed = (models) => async (event: ProjectClaimFailed) => {
  const { UserProjectClaims } = models
  const { claimedBy, projectId } = event.payload

  try {
    const [userProjectClaim, created] = await UserProjectClaims.findOrCreate({
      where: { userId: claimedBy, projectId },
      defaults: { tryCounter: 1 },
    })

    if (!created) {
      userProjectClaim.tryCounter++
      await userProjectClaim.save()
    }
  } catch (e) {
    logger.error(e)
  }
}
