import { logger } from '@core/utils';
import { ProjectActionnaireUpdated } from '@modules/project';
import { ProjectProjector, Project } from '../project.model';
import { ProjectionEnEchec } from '@modules/shared';

export const onProjectActionnaireUpdated = ProjectProjector.on(
  ProjectActionnaireUpdated,
  async (évènement, transaction) => {
    try {
      const {
        payload: { projectId, newActionnaire },
      } = évènement;
      await Project.update(
        {
          actionnaire: newActionnaire,
        },
        {
          where: { id: projectId },
          transaction,
        },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ProjectActionnaireUpdated`,
          {
            évènement,
            nomProjection: 'Project.ProjectActionnaireUpdated',
          },
          error,
        ),
      );
    }
  },
);

// export const onProjectActionnaireUpdated = (models) => async (event: ProjectActionnaireUpdated) => {
//   const { projectId, newActionnaire } = event.payload;
//   const ProjectModel = models.Project;
//   const projectInstance = await ProjectModel.findByPk(projectId);

//   if (!projectInstance) {
//     logger.error(
//       `Error: onProjectActionnaireUpdated projection failed to retrieve project from db: ${event}`,
//     );
//     return;
//   }

//   projectInstance.actionnaire = newActionnaire;

//   try {
//     await projectInstance.save();
//   } catch (e) {
//     logger.error(e);
//     logger.info('Error: onProjectActionnaireUpdated projection failed to update project', event);
//   }
// };
