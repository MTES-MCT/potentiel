import { logger } from '@core/utils';
import { ProjectClaimed } from '@modules/projectClaim/events';
import { ProjectionEnEchec } from '@modules/shared';
import { UserProjects, UserProjectsProjector } from '../userProjects.model';

export default UserProjectsProjector.on(ProjectClaimed, async (évènement, transaction) => {
  const {
    payload: { projectId, claimedBy },
  } = évènement;
  try {
    await UserProjects.create(
      { userId: claimedBy, projectId },
      {
        transaction,
      },
    );
  } catch (error) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'évènement ProjectClaimed`,
        {
          évènement,
          nomProjection: 'UserProjects.ProjectClaimed',
        },
        error,
      ),
    );
  }
});
