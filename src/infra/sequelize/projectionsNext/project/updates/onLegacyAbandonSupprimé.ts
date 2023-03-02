import { logger } from '@core/utils';
import { LegacyAbandonSupprimé } from '@modules/project';
import { ProjectProjector } from '@infra/sequelize';
import { ProjectionEnEchec } from '@modules/shared';

export const onLegacyAbandonSupprimé = ProjectProjector.on(
  LegacyAbandonSupprimé,
  async (évènement, transaction) => {
    try {
      const {} = évènement;
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement LegacyAbandonSupprimé`,
          {
            évènement,
            nomProjection: 'Project.LegacyAbandonSupprimé',
          },
          error,
        ),
      );
    }
  },
);

// export const onLegacyAbandonSupprimé = (models) => async (event: LegacyAbandonSupprimé) => {
//   const { Project } = models;
//   const {
//     payload: { dcrDueOn, completionDueOn, projetId },
//   } = event;
//   const projectInstance = await Project.findByPk(projetId);

//   if (!projectInstance) {
//     logger.error(
//       `Error: onLegacyAbandonSupprimé projection failed to retrieve project from db': ${event}`,
//     );
//     return;
//   }

//   Object.assign(projectInstance, {
//     abandonedOn: 0,
//     dcrDueOn,
//     completionDueOn,
//   });

//   try {
//     await projectInstance.save();
//   } catch (e) {
//     logger.error(e);
//     logger.info('Error: onLegacyAbandonSupprimé projection failed to update project', event);
//   }
// };
