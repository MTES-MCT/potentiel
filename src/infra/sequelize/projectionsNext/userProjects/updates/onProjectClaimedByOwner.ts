import { logger } from '@core/utils';
import { ProjectClaimedByOwner } from '@modules/projectClaim/events';
import { ProjectionEnEchec } from '@modules/shared';
import { UserProjects, UserProjectsProjector } from '../userProjects.model';

export default UserProjectsProjector.on(ProjectClaimedByOwner, async (évènement, transaction) => {
  const {
    payload: { projectId, claimedBy },
  } = évènement;
  try {
    await UserProjects.create({ userId: claimedBy, projectId });
  } catch (error) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'évènement ProjectClaimedByOwner`,
        {
          évènement,
          nomProjection: 'UserProjects.ProjectClaimedByOwner',
        },
        error,
      ),
    );
  }
});
