import { logger } from '@core/utils';
import { ProjectAbandoned } from '@modules/project';
import { Project } from '../project.model';
import { ProjectProjector } from '../project.projector';
import { ProjectionEnEchec } from '@modules/shared';

export const onProjectAbandoned = ProjectProjector.on(
  ProjectAbandoned,
  async (évènement, transaction) => {
    try {
      const {
        payload: { projectId },
        occurredAt,
      } = évènement;
      await Project.update(
        {
          abandonedOn: occurredAt.getTime(),
          dcrDueOn: 0,
          completionDueOn: 0,
        },
        {
          where: { id: projectId },
          transaction,
        },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ProjectAbandoned`,
          {
            évènement,
            nomProjection: 'Project.ProjectAbandoned',
          },
          error,
        ),
      );
    }
  },
);
