import { logger } from '@core/utils';
import { ProjectPuissanceUpdated } from '@modules/project';
import { ProjectProjector } from '@infra/sequelize';
import { ProjectionEnEchec } from '@modules/shared';

export const onProjectPuissanceUpdated = ProjectProjector.on(
  ProjectPuissanceUpdated,
  async (évènement, transaction) => {
    try {
      const {} = évènement;
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ProjectPuissanceUpdated`,
          {
            évènement,
            nomProjection: 'Project.ProjectPuissanceUpdated',
          },
          error,
        ),
      );
    }
  },
);

// export const onProjectPuissanceUpdated = (models) => async (event: ProjectPuissanceUpdated) => {
//   const { projectId, newPuissance } = event.payload;
//   const { Project } = models;
//   const projectInstance = await Project.findByPk(projectId);

//   if (!projectInstance) {
//     logger.error(
//       `Error: onProjectPuissanceUpdated projection failed to retrieve project from db: ${event}`,
//     );
//     return;
//   }

//   projectInstance.puissance = newPuissance;

//   try {
//     await projectInstance.save();
//   } catch (e) {
//     logger.error(e);
//     logger.info('Error: onProjectPuissanceUpdated projection failed to update project', event);
//   }
// };
