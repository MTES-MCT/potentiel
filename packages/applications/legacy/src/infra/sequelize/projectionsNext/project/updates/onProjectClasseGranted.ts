import { logger } from '../../../../../core/utils';
import { ProjectClasseGranted } from '../../../../../modules/project';
import { Project } from '../project.model';
import { ProjectProjector } from '../project.projector';
import { ProjectionEnEchec } from '../../../../../modules/shared';

export const onProjectClasseGranted = ProjectProjector.on(
  ProjectClasseGranted,
  async (évènement, transaction) => {
    try {
      const {
        payload: { projectId },
      } = évènement;

      await Project.update(
        {
          classe: 'Classé',
        },
        {
          where: { id: projectId },
          transaction,
        },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ProjectClasseGranted`,
          {
            évènement,
            nomProjection: 'Project.ProjectClasseGranted',
          },
          error,
        ),
      );
    }
  },
);
