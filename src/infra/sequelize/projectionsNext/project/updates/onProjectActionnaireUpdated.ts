import { logger } from '@core/utils';
import { ProjectActionnaireUpdated } from '@modules/project';
import { Project } from '../project.model';
import { ProjectProjector } from '../project.projector';
import { ProjectionEnEchec } from '@modules/shared';

export const onProjectActionnaireUpdated = ProjectProjector.on(
  ProjectActionnaireUpdated,
  async (évènement, transaction) => {
    try {
      const {
        payload: { projectId, newActionnaire },
      } = évènement;
      await Project.update(
        {
          actionnaire: newActionnaire,
        },
        {
          where: { id: projectId },
          transaction,
        },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ProjectActionnaireUpdated`,
          {
            évènement,
            nomProjection: 'Project.ProjectActionnaireUpdated',
          },
          error,
        ),
      );
    }
  },
);
