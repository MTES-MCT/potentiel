import { getLogger } from '@potentiel-libraries/monitoring';

import { UserInvitedToProject } from '../../../../../modules/authZ/events';
import { User, UserProjects } from '../..';
import { UserProjectsProjector } from '../userProjects.projector';

export default UserProjectsProjector.on(UserInvitedToProject, async (évènement, transaction) => {
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
    getLogger().error(error, {
      évènement,
      nomProjection: 'UserProjects.UserInvitedToProject',
    });
  }
});
