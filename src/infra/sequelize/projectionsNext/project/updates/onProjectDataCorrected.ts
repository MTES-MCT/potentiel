import { logger } from '@core/utils';
import { ProjectDataCorrected } from '@modules/project';
import { ProjectProjector } from '@infra/sequelize';
import { ProjectionEnEchec } from '@modules/shared';

export const onProjectDataCorrected = ProjectProjector.on(
  ProjectDataCorrected,
  async (évènement, transaction) => {
    try {
      const {} = évènement;
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
