import { logger } from '../../../../../core/utils';
import { ProjectNotified } from '../../../../../modules/project';
import { Project } from '../project.model';
import { ProjectProjector } from '../project.projector';
import { ProjectionEnEchec } from '../../../../../modules/shared';

export const onProjectNotified = ProjectProjector.on(
  ProjectNotified,
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
          `Erreur lors du traitement de l'évènement ProjectNotified`,
          {
            évènement,
            nomProjection: 'Project.ProjectNotified',
          },
          error,
        ),
      );
    }
  },
);
