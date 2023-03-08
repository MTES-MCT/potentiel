import { UserProjectClaims } from '../userProjectClaims.model';
import { UserProjectClaimsProjector } from '../userProjectClaims.projector';
import { ProjectClaimFailed } from '@modules/projectClaim';
import { logger } from '@core/utils';
import { ProjectionEnEchec } from '@modules/shared';

export default UserProjectClaimsProjector.on(ProjectClaimFailed, async (évènement, transaction) => {
  const {
    payload: { claimedBy, projectId },
  } = évènement;
  try {
    const userProjectClaim = await UserProjectClaims.findOne({
      where: { userId: claimedBy, projectId },
      transaction,
    });

    const previousFailedAttemps = userProjectClaim?.failedAttempts || 0;

    await UserProjectClaims.upsert(
      {
        userId: claimedBy,
        projectId,
        failedAttempts: previousFailedAttemps + 1,
      },
      {
        transaction,
      },
    );
  } catch (error) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'évènement ProjectClaimFailed`,
        {
          évènement,
          nomProjection: 'UserProjectClaims.ProjectClaimFailed',
        },
        error,
      ),
    );
  }
});
