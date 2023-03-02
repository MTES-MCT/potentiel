import { logger } from '@core/utils';
import { ProjectReimported } from '@modules/project';
import { ProjectProjector } from '@infra/sequelize';
import { ProjectionEnEchec } from '@modules/shared';

export const onProjectReimported = ProjectProjector.on(
  ProjectReimported,
  async (évènement, transaction) => {
    try {
      const {} = évènement;
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ProjectReimported`,
          {
            évènement,
            nomProjection: 'Project.ProjectReimported',
          },
          error,
        ),
      );
    }
  },
);

// export const onProjectReimported = (models) => async (event: ProjectReimported) => {
//   const { Project } = models;

//   const { projectId, data } = event.payload;

//   try {
//     const project = await Project.findByPk(projectId);

//     if (project === null) {
//       throw new Error(`onProjectReimported for project that is not found ${projectId}`);
//     }

//     const { details, ...other } = data;

//     if (details) {
//       Object.assign(project.details, details);
//       project.changed('details', true);
//     }

//     Object.assign(project, {
//       ...other,
//       evaluationCarboneDeRéférence: other.evaluationCarbone ?? project.evaluationCarboneDeRéférence,
//     });

//     await project.save();
//   } catch (e) {
//     logger.error(e);
//     logger.info('Error: onProjectReimported projection failed to update project', event);
//   }
// };
