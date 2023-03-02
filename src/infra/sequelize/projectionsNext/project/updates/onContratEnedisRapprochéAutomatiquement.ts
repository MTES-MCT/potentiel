import { logger } from '@core/utils';
import { ContratEnedisRapprochéAutomatiquement } from '@modules/enedis';
import { ProjectProjector } from '@infra/sequelize';
import { ProjectionEnEchec } from '@modules/shared';

export const onContratEnedisRapprochéAutomatiquement = ProjectProjector.on(
  ContratEnedisRapprochéAutomatiquement,
  async (évènement, transaction) => {
    try {
      const {} = évènement;
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ContratEnedisRapprochéAutomatiquement`,
          {
            évènement,
            nomProjection: 'Project.ContratEnedisRapprochéAutomatiquement',
          },
          error,
        ),
      );
    }
  },
);

// export const onContratEnedisRapprochéAutomatiquement =
//   (models) => async (event: ContratEnedisRapprochéAutomatiquement) => {
//     const { projectId, numero } = event.payload;
//     const { Project } = models;
//     const projectInstance = await Project.findByPk(projectId);

//     if (!projectInstance) {
//       logger.error(
//         `Error: onEnedisContractAutomaticallyLinkedToProject projection failed to retrieve project from db: ${event}`,
//       );
//       return;
//     }

//     projectInstance.contratEnedis = {
//       numero,
//     };

//     try {
//       await projectInstance.save();
//     } catch (e) {
//       logger.error(e);
//       logger.info(
//         'Error: onEnedisContractAutomaticallyLinkedToProject projection failed to update project',
//         event,
//       );
//     }
//   };
