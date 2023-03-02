import { logger } from '@core/utils';
import { ContratEDFRapprochéAutomatiquement } from '@modules/edf';
import { ProjectProjector } from '@infra/sequelize';
import { ProjectionEnEchec } from '@modules/shared';

export const onContratEDFRapprochéAutomatiquement = ProjectProjector.on(
  ContratEDFRapprochéAutomatiquement,
  async (évènement, transaction) => {
    try {
      const {} = évènement;
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ContratEDFRapprochéAutomatiquement`,
          {
            évènement,
            nomProjection: 'Project.ContratEDFRapprochéAutomatiquement',
          },
          error,
        ),
      );
    }
  },
);

// export const onContratEDFRapprochéAutomatiquement =
//   (models) => async (event: ContratEDFRapprochéAutomatiquement) => {
//     const { projectId, numero, type, dateEffet, dateSignature, dateMiseEnService, statut, duree } =
//       event.payload;
//     const { Project } = models;
//     const projectInstance = await Project.findByPk(projectId);

//     if (!projectInstance) {
//       logger.error(
//         `Error: onEDFContractAutomaticallyLinkedToProject projection failed to retrieve project from db: ${event}`,
//       );
//       return;
//     }

//     projectInstance.contratEDF = {
//       numero,
//       type,
//       dateEffet,
//       dateSignature,
//       dateMiseEnService,
//       statut,
//       duree: duree && Number(duree),
//     };

//     try {
//       await projectInstance.save();
//     } catch (e) {
//       logger.error(e);
//       logger.info(
//         'Error: onEDFContractAutomaticallyLinkedToProject projection failed to update project',
//         event,
//       );
//     }
//   };
