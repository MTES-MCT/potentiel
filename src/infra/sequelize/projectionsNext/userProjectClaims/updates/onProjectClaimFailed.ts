// import { logger } from '@core/utils'
// import { ProjectClaimFailed } from '@modules/projectClaim/events'

// export const onProjectClaimFailed = (models) => async (event: ProjectClaimFailed) => {
//   const { UserProjectClaims } = models
//   const { claimedBy, projectId } = event.payload

//   try {
//     const [userProjectClaim, created] = await UserProjectClaims.findOrCreate({
//       where: { userId: claimedBy, projectId },
//       defaults: { failedAttempts: 1 },
//     })

//     if (!created) {
//       userProjectClaim.failedAttempts++
//       await userProjectClaim.save()
//     }
//   } catch (e) {
//     logger.error(e)
//   }
// }

import { UserProjectClaims, UserProjectClaimsProjector } from '../userProjectClaims.model'
import { ProjectClaimFailed } from '@modules/projectClaim'
import { logger } from '@core/utils'
import { ProjectionEnEchec } from '@modules/shared'

export default UserProjectClaimsProjector.on(ProjectClaimFailed, async (évènement, transaction) => {
  const {
    payload: { claimedBy, projectId },
  } = évènement
  try {
    const userProjectClaim = await UserProjectClaims.findOne({
      where: { userId: claimedBy, projectId },
      transaction,
    })

    const previousFailedAttemps = userProjectClaim?.failedAttempts || 0

    await UserProjectClaims.upsert(
      {
        userId: claimedBy,
        projectId,
        failedAttempts: previousFailedAttemps + 1,
      },
      {
        transaction,
      }
    )
  } catch (error) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'évènement ProjectClaimFailed`,
        {
          évènement,
          nomProjection: 'UserProjectClaims.ProjectClaimFailed',
        },
        error
      )
    )
  }
})
