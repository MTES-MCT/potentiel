import { logger } from '@core/utils';
import { ProjectCertificateRegenerated } from '@modules/project';
import { Project } from '../project.model';
import { ProjectProjector } from '../project.projector';
import { ProjectionEnEchec } from '@modules/shared';

export const onProjectCertificateRegenerated = ProjectProjector.on(
  ProjectCertificateRegenerated,
  async (évènement, transaction) => {
    try {
      const {
        payload: { certificateFileId, projectId },
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
          `Erreur lors du traitement de l'évènement ProjectCertificateRegenerated`,
          {
            évènement,
            nomProjection: 'Project.ProjectCertificateRegenerated',
          },
          error,
        ),
      );
    }
  },
);
