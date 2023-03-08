import { logger } from '@core/utils';
import { UserProjectsLinkedByContactEmail } from '@modules/authZ/events';
import { ProjectionEnEchec } from '@modules/shared/errors';
import { UserProjects } from '../userProjects.model';
import { UserProjectsProjector } from '../userProjects.projector';

export default UserProjectsProjector.on(
  UserProjectsLinkedByContactEmail,
  async (évènement, transaction) => {
    const {
      payload: { userId, projectIds },
    } = évènement;
    try {
      await UserProjects.bulkCreate(
        projectIds.map((projectId) => ({ userId, projectId })),
        { transaction },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement UserProjectsLinkedByContactEmail`,
          {
            évènement,
            nomProjection: 'UserProjects.UserProjectsLinkedByContactEmail',
          },
          error,
        ),
      );
    }
  },
);
