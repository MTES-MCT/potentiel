import { logger } from '../../../../../core/utils';
import { ProjectDCRDueDateCancelled } from '../../../../../modules/project';
import { Project } from '../project.model';
import { ProjectProjector } from '../project.projector';
import { ProjectionEnEchec } from '../../../../../modules/shared';

export const onProjectDCRDueDateCancelled = ProjectProjector.on(
  ProjectDCRDueDateCancelled,
  async (évènement, transaction) => {
    try {
      const {
        payload: { projectId },
      } = évènement;

      await Project.update(
        {
          dcrDueOn: 0,
        },
        {
          where: { id: projectId },
          transaction,
        },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ProjectDCRDueDateCancelled`,
          {
            évènement,
            nomProjection: 'Project.ProjectDCRDueDateCancelled',
          },
          error,
        ),
      );
    }
  },
);
