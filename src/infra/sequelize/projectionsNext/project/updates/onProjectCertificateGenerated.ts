import { logger } from '../../../../../core/utils';
import { ProjectCertificateGenerated } from '../../../../../modules/project';

import { Project } from '../project.model';
import { ProjectProjector } from '../project.projector';
import { ProjectionEnEchec } from '../../../../../modules/shared';

export const onProjectCertificateGenerated = ProjectProjector.on(
  ProjectCertificateGenerated,
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
          `Erreur lors du traitement de l'évènement ProjectCertificateGenerated`,
          {
            évènement,
            nomProjection: 'Project.ProjectCertificateGenerated',
          },
          error,
        ),
      );
    }
  },
);
