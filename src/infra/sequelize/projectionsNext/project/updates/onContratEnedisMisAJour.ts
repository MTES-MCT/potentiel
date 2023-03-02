import { logger } from '@core/utils';
import { ContratEnedisMisAJour } from '@modules/enedis';
import { ProjectProjector } from '@infra/sequelize';
import { ProjectionEnEchec } from '@modules/shared';

export const onContratEnedisMisAJour = ProjectProjector.on(
  ContratEnedisMisAJour,
  async (évènement, transaction) => {
    try {
      const {} = évènement;
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ContratEnedisMisAJour`,
          {
            évènement,
            nomProjection: 'Project.ContratEnedisMisAJour',
          },
          error,
        ),
      );
    }
  },
);

// export const onContratEnedisMisAJour = (models) => async (event: ContratEnedisMisAJour) => {
//   const { projectId, numero } = event.payload;
//   const { Project } = models;
//   const projectInstance = await Project.findByPk(projectId);

//   if (!projectInstance) {
//     logger.error(
//       `Error: onContratEnedisMisAJour projection failed to retrieve project from db: ${event}`,
//     );
//     return;
//   }

//   projectInstance.contratEnedis = {
//     ...projectInstance.contratEnedis,
//     numero,
//   };
//   projectInstance.changed('contratEnedis', true);

//   try {
//     await projectInstance.save();
//   } catch (e) {
//     logger.error(e);
//     logger.info('Error: onContratEnedisMisAJour projection failed to update project', event);
//   }
// };
