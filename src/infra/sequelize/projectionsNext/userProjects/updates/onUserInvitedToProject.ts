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
    const userProjectIds = (await UserProjects.findAll({ where: { userId } })).map(
      (project) => project.projectId,
    );
    const filteredProjectIds = projectIds
      .filter((projectId) => !userProjectIds.includes(projectId))
      .map((projectId) => ({ userId, projectId }));

    await UserProjects.bulkCreate(filteredProjectIds, { transaction });
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
