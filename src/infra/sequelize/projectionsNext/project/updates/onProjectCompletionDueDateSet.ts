import { logger } from '@core/utils';
import { ProjectCompletionDueDateSet } from '@modules/project';
import { ProjectProjector } from '@infra/sequelize';
import { ProjectionEnEchec } from '@modules/shared';

export const onProjectCompletionDueDateSet = ProjectProjector.on(
  ProjectCompletionDueDateSet,
  async (évènement, transaction) => {
    try {
      const {} = évènement;
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ProjectCompletionDueDateSet`,
          {
            évènement,
            nomProjection: 'Project.ProjectCompletionDueDateSet',
          },
          error,
        ),
      );
    }
  },
);

// export const onProjectCompletionDueDateSet =
//   (models) => async (event: ProjectCompletionDueDateSet) => {
//     const ProjectModel = models.Project;
//     const projectInstance = await ProjectModel.findByPk(event.payload.projectId);

//     if (!projectInstance) {
//       logger.error(
//         `Error: onProjectCompletionDueDateSet projection failed to retrieve project from db': ${event}`,
//       );
//       return;
//     }

//     projectInstance.completionDueOn = event.payload.completionDueOn;

//     try {
//       await projectInstance.save();
//     } catch (e) {
//       logger.error(e);
//       logger.info(
//         'Error: onProjectCompletionDueDateSet projection failed to update project',
//         event,
//       );
//     }
//   };
