import { logger } from '@core/utils';
import { ProjectCompletionDueDateSet } from '@modules/project';
import { Project } from '../project.model';
import { ProjectProjector } from '../project.projector';
import { ProjectionEnEchec } from '@modules/shared';

export const onProjectCompletionDueDateSet = ProjectProjector.on(
  ProjectCompletionDueDateSet,
  async (évènement, transaction) => {
    try {
      const {
        payload: { projectId, completionDueOn },
      } = évènement;

      await Project.update(
        {
          completionDueOn,
        },
        {
          where: { id: projectId },
          transaction,
        },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ProjectCompletionDueDateSet`,
          {
            évènement,
            nomProjection: 'Project.ProjectCompletionDueDateSet',
          },
          error,
        ),
      );
    }
  },
);
