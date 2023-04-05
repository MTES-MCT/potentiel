import { logger } from '@core/utils';
import { UserInvitedToProject } from '@modules/authZ/events';
import { ProjectionEnEchec } from '@modules/shared';
import { UserProjects } from '../userProjects.model';
import { UserProjectsProjector } from '../userProjects.projector';
import { User } from '../../users/users.model';

export default UserProjectsProjector.on(UserInvitedToProject, async (évènement, transaction) => {
  const {
    payload: { userId, projectIds },
  } = évènement;
  try {
    const foundUser = await User.findOne({ where: { id: userId } });
    const allUsers = await User.findAll({ where: { email: foundUser?.email } });

    for (const user of allUsers) {
      const userProjectIds = (
        await UserProjects.findAll({ where: { userId: user.id }, transaction })
      ).map((project) => project.projectId);
      const filteredProjectIds = projectIds
        .filter((projectId) => !userProjectIds.includes(projectId))
        .map((projectId) => ({ userId: user.id, projectId }));

      await UserProjects.bulkCreate(filteredProjectIds, { transaction });
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
