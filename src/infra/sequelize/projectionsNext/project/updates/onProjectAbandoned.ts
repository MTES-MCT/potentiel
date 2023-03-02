import { logger } from '@core/utils';
import { ProjectAbandoned } from '@modules/project';
import { ProjectProjector } from '@infra/sequelize';
import { ProjectionEnEchec } from '@modules/shared';

export const onProjectAbandoned = ProjectProjector.on(
  ProjectAbandoned,
  async (évènement, transaction) => {
    try {
      const {} = évènement;
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ProjectAbandoned`,
          {
            évènement,
            nomProjection: 'Project.ProjectAbandoned',
          },
          error,
        ),
      );
    }
  },
);

// export const onProjectAbandoned = (models) => async (event: ProjectAbandoned) => {
//   const { Project } = models;
//   const projectInstance = await Project.findByPk(event.payload.projectId);

//   if (!projectInstance) {
//     logger.error(
//       `Error: onProjectAbandoned projection failed to retrieve project from db': ${event}`,
//     );
//     return;
//   }

//   const { occurredAt } = event;
//   Object.assign(projectInstance, {
//     abandonedOn: occurredAt.getTime(),
//     dcrDueOn: 0,
//     completionDueOn: 0,
//   });

//   try {
//     await projectInstance.save();
//   } catch (e) {
//     logger.error(e);
//     logger.info('Error: onProjectAbandoned projection failed to update project', event);
//   }
// };
