import { logger } from '@core/utils';
import { ProjectDataCorrected } from '@modules/project';
import { ProjectProjector, Project } from '../project.model';
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

// export const onProjectDataCorrected = (models) => async (event: ProjectDataCorrected) => {
//   const ProjectModel = models.Project;
//   const projectInstance = await ProjectModel.findByPk(event.payload.projectId);

//   if (!projectInstance) {
//     logger.error(
//       `Error: onProjectDataCorrected projection failed to retrieve project from db ${event}`,
//     );
//     return;
//   }

//   Object.assign(projectInstance, {
//     ...event.payload.correctedData,
//     evaluationCarboneDeRéférence:
//       event.payload.correctedData.evaluationCarbone ?? projectInstance.evaluationCarboneDeRéférence,
//   });

//   try {
//     await projectInstance.save();
//   } catch (e) {
//     logger.error(e);
//     logger.info('Error: onProjectDataCorrected projection failed to update project', event);
//   }
// };
