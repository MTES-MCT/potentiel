import { logger } from '@core/utils';
import { ProjectProducteurUpdated } from '@modules/project';
import { ProjectProjector, Project } from '../project.model';
import { ProjectionEnEchec } from '@modules/shared';

export const onProjectProducteurUpdated = ProjectProjector.on(
  ProjectProducteurUpdated,
  async (évènement, transaction) => {
    try {
      const {
        payload: { projectId, newProducteur },
      } = évènement;
      await Project.update(
        {
          nomCandidat: newProducteur,
        },
        {
          where: { id: projectId },
          transaction,
        },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ProjectProducteurUpdated`,
          {
            évènement,
            nomProjection: 'Project.ProjectProducteurUpdated',
          },
          error,
        ),
      );
    }
  },
);

// export const onProjectProducteurUpdated = (models) => async (event: ProjectProducteurUpdated) => {
//   const { projectId, newProducteur } = event.payload;
//   const ProjectModel = models.Project;
//   const projectInstance = await ProjectModel.findByPk(projectId);

//   if (!projectInstance) {
//     logger.error(
//       `Error: onProjectProducteurUpdated projection failed to retrieve project from db: ${event}`,
//     );
//     return;
//   }

//   projectInstance.nomCandidat = newProducteur;

//   try {
//     await projectInstance.save();
//   } catch (e) {
//     logger.error(e);
//     logger.info('Error: onProjectProducteurUpdated projection failed to update project', event);
//   }
// };
