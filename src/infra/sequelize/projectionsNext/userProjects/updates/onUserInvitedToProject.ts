import { logger } from '@core/utils';
import { UserInvitedToProject } from '@modules/authZ/events';
import { ProjectionEnEchec } from '@modules/shared';
import { UserProjects } from '../userProjects.model';
import { UserProjectsProjector } from '../userProjects.projector';

export default UserProjectsProjector.on(UserInvitedToProject, async (évènement, transaction) => {
  const {
    payload: { userId, projectIds },
  } = évènement;
  try {
    for (const projectId of projectIds) {
      await UserProjects.findOrCreate({ where: { userId, projectId }, transaction });
    }
  } catch (error) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'évènement UserInvitedToProject`,
        {
          évènement,
          nomProjection: 'UserProjects.UserInvitedToProject',
        },
        error,
      ),
    );
  }
});
