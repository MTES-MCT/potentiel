import { logger } from '@core/utils';
import { ProjectNotificationDateSet } from '@modules/project';
import { Project } from '../project.model';
import { ProjectProjector } from '../project.projector';
import { ProjectionEnEchec } from '@modules/shared';

export const onProjectNotificationDateSet = ProjectProjector.on(
  ProjectNotificationDateSet,
  async (évènement, transaction) => {
    try {
      const {
        payload: { projectId, notifiedOn },
      } = évènement;

      await Project.update(
        {
          notifiedOn,
        },
        {
          where: { id: projectId },
          transaction,
        },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ProjectNotificationDateSet`,
          {
            évènement,
            nomProjection: 'Project.ProjectNotificationDateSet',
          },
          error,
        ),
      );
    }
  },
);
