import { logger } from '@core/utils';
import { ProjectClaimed } from '@modules/projectClaim/events';
import { Project } from '../project.model';
import { ProjectProjector } from '../project.projector';
import { EntityNotFoundError, ProjectionEnEchec } from '@modules/shared';

export const onProjectClaimed = ProjectProjector.on(
  ProjectClaimed,
  async (évènement, transaction) => {
    try {
      const {
        payload: { projectId, claimerEmail, attestationDesignationFileId },
      } = évènement;

      const project = await Project.findByPk(projectId);

      if (project === null) {
        throw new EntityNotFoundError();
      }

      await Project.update(
        {
          certificateFileId: attestationDesignationFileId,
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
          `Erreur lors du traitement de l'évènement ProjectClaimed`,
          {
            évènement,
            nomProjection: 'Project.ProjectClaimed',
          },
          error,
        ),
      );
    }
  },
);
