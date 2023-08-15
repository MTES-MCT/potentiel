import { logger } from '../../../../../core/utils';
import { ProjectCompletionDueDateCancelled } from '../../../../../modules/project';
import { Project } from '../project.model';
import { ProjectProjector } from '../project.projector';
import { ProjectionEnEchec } from '../../../../../modules/shared';

export const onProjectCompletionDueDateCancelled = ProjectProjector.on(
  ProjectCompletionDueDateCancelled,
  async (évènement, transaction) => {
    try {
      const {
        payload: { projectId },
      } = évènement;

      await Project.update(
        {
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
          `Erreur lors du traitement de l'évènement ProjectCompletionDueDateCancelled`,
          {
            évènement,
            nomProjection: 'Project.ProjectCompletionDueDateCancelled',
          },
          error,
        ),
      );
    }
  },
);
