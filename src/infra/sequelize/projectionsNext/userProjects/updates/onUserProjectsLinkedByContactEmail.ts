import { logger } from '../../../../../core/utils';
import { UserProjectsLinkedByContactEmail } from '../../../../../modules/authZ/events';
import { ProjectionEnEchec } from '../../../../../modules/shared/errors';
import { User, UserProjects } from '../..';
import { UserProjectsProjector } from '../userProjects.projector';

export default UserProjectsProjector.on(
  UserProjectsLinkedByContactEmail,
  async (évènement, transaction) => {
    const {
      payload: { userId, projectIds },
    } = évènement;
    try {
      const foundUser = await User.findOne({ where: { id: userId } });
      const allUsers = await User.findAll({ where: { email: foundUser?.email } });

      await Promise.all(
        allUsers.map(async (user) => {
          const userProjectIds = (
            await UserProjects.findAll({ where: { userId: user.id }, transaction })
          ).map((project) => project.projectId);
          const filteredProjectIds = projectIds
            .filter((projectId) => !userProjectIds.includes(projectId))
            .map((projectId) => ({ userId: user.id, projectId }));

          await UserProjects.bulkCreate(filteredProjectIds, { transaction });
        }),
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
