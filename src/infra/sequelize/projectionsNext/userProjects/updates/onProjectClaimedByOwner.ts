import { logger } from '@core/utils';
import { ProjectClaimedByOwner } from '@modules/projectClaim/events';
import { ProjectionEnEchec } from '@modules/shared';
import { User, UserProjects } from '@infra/sequelize/projectionsNext';
import { UserProjectsProjector } from '../userProjects.projector';

export default UserProjectsProjector.on(ProjectClaimedByOwner, async (évènement, transaction) => {
  const {
    payload: { projectId, claimedBy: userId },
  } = évènement;
  try {
    const foundUser = await User.findOne({ where: { id: userId } });
    const allUsers = await User.findAll({ where: { email: foundUser?.email } });

    for (const user of allUsers) {
      await UserProjects.findOrCreate({ where: { userId: user.id, projectId }, transaction });
    }
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
