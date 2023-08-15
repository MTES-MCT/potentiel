import { logger } from '../../../../../core/utils';
import { ProjectClaimed } from '../../../../../modules/projectClaim/events';
import { ProjectionEnEchec } from '../../../../../modules/shared';
import { User, UserProjects } from "../..";
import { UserProjectsProjector } from '../userProjects.projector';

export default UserProjectsProjector.on(ProjectClaimed, async (évènement, transaction) => {
  const {
    payload: { projectId, claimedBy: userId },
  } = évènement;
  try {
    const foundUser = await User.findOne({ where: { id: userId } });
    const allUsers = await User.findAll({ where: { email: foundUser?.email } });

    await Promise.all(
      allUsers.map((user) =>
        UserProjects.findOrCreate({ where: { userId: user.id, projectId }, transaction }),
      ),
    );
  } catch (error) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'évènement ProjectClaimed`,
        {
          évènement,
          nomProjection: 'UserProjects.ProjectClaimed',
        },
        error,
      ),
    );
  }
});
