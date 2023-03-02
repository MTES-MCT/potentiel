import { logger } from '@core/utils';
import { IdentifiantPotentielPPE2Batiment2Corrigé } from '@modules/project';
import { ProjectProjector } from '@infra/sequelize';
import { ProjectionEnEchec } from '@modules/shared';

export const onIdentifiantPotentielPPE2Batiment2Corrigé = ProjectProjector.on(
  IdentifiantPotentielPPE2Batiment2Corrigé,
  async (évènement, transaction) => {
    try {
      const {} = évènement;
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement IdentifiantPotentielPPE2Batiment2Corrigé`,
          {
            évènement,
            nomProjection: 'Project.IdentifiantPotentielPPE2Batiment2Corrigé',
          },
          error,
        ),
      );
    }
  },
);

// export const onIdentifiantPotentielPPE2Batiment2Corrigé =
//   (models) => async (évènement: IdentifiantPotentielPPE2Batiment2Corrigé) => {
//     const { projectId, nouvelIdentifiant } = évènement.payload;
//     const { Project } = models;
//     const projectInstance = await Project.findByPk(projectId);

//     if (!projectInstance) {
//       logger.error(
//         new ProjectionEnEchec(`Le projet n'existe pas`, {
//           nomProjection: 'onIdentifiantPotentielPPE2Batiment2Corrigé',
//           évènement,
//         }),
//       );
//       return;
//     }

//     projectInstance.potentielIdentifier = nouvelIdentifiant;

//     try {
//       await projectInstance.save();
//     } catch (e) {
//       logger.error(
//         new ProjectionEnEchec(
//           `Erreur lors de l'enregistrement des modifications sur la projection Project`,
//           {
//             nomProjection: 'onIdentifiantPotentielPPE2Batiment2Corrigé',
//             évènement,
//           },
//           e,
//         ),
//       );
//     }
//   };
