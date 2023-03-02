import { logger } from '@core/utils';
import { ProjectDCRDueDateCancelled } from '@modules/project';
import { ProjectProjector } from '@infra/sequelize';
import { ProjectionEnEchec } from '@modules/shared';

export const onProjectDCRDueDateCancelled = ProjectProjector.on(
  ProjectDCRDueDateCancelled,
  async (évènement, transaction) => {
    try {
      const {} = évènement;
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
