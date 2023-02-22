import { logger } from '@core/utils';
import { UserRightsToProjectGranted } from '@modules/authZ';
import { ProjectionEnEchec } from '@modules/shared';
import { UserProjects, UserProjectsProjector } from '../userProjects.model';

export default UserProjectsProjector.on(
  UserRightsToProjectGranted,
  async (évènement, transaction) => {
    const {
      payload: { userId, projectId },
    } = évènement;
    try {
      await UserProjects.create(
        {
          userId,
          projectId,
        },
        { transaction },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement UserRightsToProjectGranted`,
          {
            évènement,
            nomProjection: 'UserProjects.UserRightsToProjectGranted',
          },
          error,
        ),
      );
    }
  },
);
