import { logger } from '@core/utils';
import { ProjectCertificateObsolete } from '@modules/project';
import { ProjectProjector, Project } from '../project.model';
import { ProjectionEnEchec } from '@modules/shared';

export const onProjectCertificateObsolete = ProjectProjector.on(
  ProjectCertificateObsolete,
  async (évènement, transaction) => {
    try {
      const {
        payload: { projectId },
      } = évènement;
      await Project.update(
        {
          certificateFileId: null,
        },
        {
          where: { id: projectId },
          transaction,
        },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ProjectCertificateObsolete`,
          {
            évènement,
            nomProjection: 'Project.ProjectCertificateObsolete',
          },
          error,
        ),
      );
    }
  },
);
