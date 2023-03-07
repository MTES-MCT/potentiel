import { logger } from '@core/utils';
import { ProjectCertificateUpdated } from '@modules/project';
import { Project } from '../project.model';
import { ProjectProjector } from '../project.projector';
import { ProjectionEnEchec } from '@modules/shared';

export const onProjectCertificateUpdated = ProjectProjector.on(
  ProjectCertificateUpdated,
  async (évènement, transaction) => {
    try {
      const {
        payload: { projectId, certificateFileId },
      } = évènement;

      await Project.update(
        {
          certificateFileId,
        },
        {
          where: { id: projectId },
          transaction,
        },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ProjectCertificateUpdated`,
          {
            évènement,
            nomProjection: 'Project.ProjectCertificateUpdated',
          },
          error,
        ),
      );
    }
  },
);
