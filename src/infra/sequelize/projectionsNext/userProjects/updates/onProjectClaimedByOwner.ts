import { logger } from '@core/utils';
import { ProjectClaimedByOwner } from '@modules/projectClaim/events';
import { ProjectionEnEchec } from '@modules/shared';
import { UserProjects } from '../userProjects.model';
import { UserProjectsProjector } from '../userProjects.projector';
import { User } from '../../users/users.model';

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
