import { logger } from '@core/utils';
import { ProjectDataCorrected } from '@modules/project';
import { Project } from '../project.model';
import { ProjectProjector } from '../project.projector';
import { ProjectionEnEchec } from '@modules/shared';

export const onProjectDataCorrected = ProjectProjector.on(
  ProjectDataCorrected,
  async (évènement, transaction) => {
    try {
      const {
        payload: { projectId, correctedData },
      } = évènement;

      const projet = await Project.findByPk(projectId);

      if (!projet) {
        logger.error(
          `Error: onProjectDataCorrected projection failed to retrieve project from db ${event}`,
        );
        return;
      }

      await Project.update(
        {
          ...correctedData,
          evaluationCarboneDeRéférence:
            correctedData.evaluationCarbone ?? projet.evaluationCarboneDeRéférence,
        },
        {
          where: { id: projectId },
          transaction,
        },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ProjectDataCorrected`,
          {
            évènement,
            nomProjection: 'Project.ProjectDataCorrected',
          },
          error,
        ),
      );
    }
  },
);
