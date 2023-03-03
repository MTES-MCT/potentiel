import { logger } from '@core/utils';
import { ProjectClaimedByOwner } from '@modules/projectClaim/events';
import { ProjectProjector, Project } from '../project.model';
import { ProjectionEnEchec } from '@modules/shared';

export const onProjectClaimedByOwner = ProjectProjector.on(
  ProjectClaimedByOwner,
  async (évènement, transaction) => {
    try {
      const {
        payload: { claimerEmail, projectId },
      } = évènement;

      await Project.update(
        {
          email: claimerEmail,
        },
        {
          where: { id: projectId },
          transaction,
        },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ProjectClaimedByOwner`,
          {
            évènement,
            nomProjection: 'Project.ProjectClaimedByOwner',
          },
          error,
        ),
      );
    }
  },
);
