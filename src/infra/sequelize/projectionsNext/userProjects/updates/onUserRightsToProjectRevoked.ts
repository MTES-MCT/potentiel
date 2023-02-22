import { logger } from '@core/utils';
import { UserRightsToProjectRevoked } from '@modules/authZ';
import { ProjectionEnEchec } from '@modules/shared';
import { UserProjects, UserProjectsProjector } from '../userProjects.model';

export default UserProjectsProjector.on(
  UserRightsToProjectRevoked,
  async (évènement, transaction) => {
    const {
      payload: { userId, projectId },
    } = évènement;
    try {
      await UserProjects.destroy({
        where: {
          userId,
          projectId,
        },
        transaction,
      });
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement UserRightsToProjectRevoked`,
          {
            évènement,
            nomProjection: 'UserProjects.UserRightsToProjectRevoked',
          },
          error,
        ),
      );
    }
  },
);
