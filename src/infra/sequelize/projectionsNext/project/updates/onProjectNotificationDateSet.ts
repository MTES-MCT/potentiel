import { logger } from '@core/utils';
import { ProjectNotificationDateSet } from '@modules/project';
import { ProjectProjector, Project } from '../project.model';
import { ProjectionEnEchec } from '@modules/shared';

export const onProjectNotificationDateSet = ProjectProjector.on(
  ProjectNotificationDateSet,
  async (évènement, transaction) => {
    try {
      const {
        payload: { projectId, notifiedOn },
      } = évènement;

      await Project.update(
        {
          notifiedOn,
        },
        {
          where: { id: projectId },
          transaction,
        },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ProjectNotificationDateSet`,
          {
            évènement,
            nomProjection: 'Project.ProjectNotificationDateSet',
          },
          error,
        ),
      );
    }
  },
);

// export const onProjectNotificationDateSet =
//   (models) => async (event: ProjectNotificationDateSet) => {
//     const ProjectModel = models.Project;
//     const projectInstance = await ProjectModel.findByPk(event.payload.projectId);

//     if (!projectInstance) {
//       logger.error(
//         `Error: onProjectNotificationDateSet projection failed to retrieve project from db: ${event}`,
//       );
//       return;
//     }

//     // update notifiedOn
//     projectInstance.notifiedOn = event.payload.notifiedOn;

//     try {
//       await projectInstance.save();
//     } catch (e) {
//       logger.error(e);
//       logger.info('Error: onProjectNotificationDateSet projection failed to update project', event);
//     }
//   };
