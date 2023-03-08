import { logger } from '@core/utils';
import { ProjectProducteurUpdated } from '@modules/project';
import { Project } from '../project.model';
import { ProjectProjector } from '../project.projector';
import { ProjectionEnEchec } from '@modules/shared';

export const onProjectProducteurUpdated = ProjectProjector.on(
  ProjectProducteurUpdated,
  async (évènement, transaction) => {
    try {
      const {
        payload: { projectId, newProducteur },
      } = évènement;
      await Project.update(
        {
          nomCandidat: newProducteur,
        },
        {
          where: { id: projectId },
          transaction,
        },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ProjectProducteurUpdated`,
          {
            évènement,
            nomProjection: 'Project.ProjectProducteurUpdated',
          },
          error,
        ),
      );
    }
  },
);
