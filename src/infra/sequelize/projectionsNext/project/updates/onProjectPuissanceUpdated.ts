import { logger } from '@core/utils';
import { ProjectPuissanceUpdated } from '@modules/project';
import { ProjectProjector, Project } from '../project.model';
import { ProjectionEnEchec } from '@modules/shared';

export const onProjectPuissanceUpdated = ProjectProjector.on(
  ProjectPuissanceUpdated,
  async (évènement, transaction) => {
    try {
      const {
        payload: { projectId, newPuissance },
      } = évènement;
      await Project.update(
        {
          puissance: newPuissance,
        },
        {
          where: { id: projectId },
          transaction,
        },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ProjectPuissanceUpdated`,
          {
            évènement,
            nomProjection: 'Project.ProjectPuissanceUpdated',
          },
          error,
        ),
      );
    }
  },
);
