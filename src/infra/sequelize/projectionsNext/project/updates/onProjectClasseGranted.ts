import { logger } from '@core/utils';
import { ProjectClasseGranted } from '@modules/project';
import { ProjectProjector, Project } from '../project.model';
import { ProjectionEnEchec } from '@modules/shared';

export const onProjectClasseGranted = ProjectProjector.on(
  ProjectClasseGranted,
  async (évènement, transaction) => {
    try {
      const {
        payload: { projectId },
      } = évènement;

      await Project.update(
        {
          classe: 'Classé',
        },
        {
          where: { id: projectId },
          transaction,
        },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ProjectClasseGranted`,
          {
            évènement,
            nomProjection: 'Project.ProjectClasseGranted',
          },
          error,
        ),
      );
    }
  },
);

// export const onProjectClasseGranted = (models) => async (event: ProjectClasseGranted) => {
//   const ProjectModel = models.Project;
//   const projectInstance = await ProjectModel.findByPk(event.payload.projectId);

//   if (!projectInstance) {
//     logger.error(
//       `Error: onProjectClasseGranted projection failed to retrieve project from db ${event}`,
//     );
//     return;
//   }

//   projectInstance.classe = 'Classé';

//   try {
//     await projectInstance.save();
//   } catch (e) {
//     logger.error(e);
//     logger.info('Error: onProjectClasseGranted projection failed to update project', event);
//   }
// };
