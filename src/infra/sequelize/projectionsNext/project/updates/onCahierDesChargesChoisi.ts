import { CahierDesChargesChoisi } from '@modules/project';

import { logger } from '@core/utils';
import { ProjectProjector } from '@infra/sequelize';
import { ProjectionEnEchec } from '@modules/shared';

export const onCahierDesChargesChoisi = ProjectProjector.on(
  CahierDesChargesChoisi,
  async (évènement, transaction) => {
    try {
      const {} = évènement;
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement OnCahierDesChargesChoisi`,
          {
            évènement,
            nomProjection: 'Project.OnCahierDesChargesChoisi',
          },
          error,
        ),
      );
    }
  },
);

// type OnCahierDesChargesChoisi = (
//   projections: Projections,
// ) => (événement: CahierDesChargesChoisi) => Promise<void>;

// export const onCahierDesChargesChoisi: OnCahierDesChargesChoisi =
//   ({ Project }) =>
//   async (évènement) => {
//     const { payload } = évènement;
//     try {
//       await Project.update(
//         {
//           cahierDesChargesActuel: formatCahierDesChargesRéférence(payload),
//         },
//         { where: { id: payload.projetId } },
//       );
//     } catch (cause) {
//       logger.error(
//         new ProjectionEnEchec(
//           'Erreur lors de la projection du nouveau cahier des charges choisi',
//           {
//             nomProjection: 'onCahierDesChargesChoisi',
//             évènement,
//           },
//           cause,
//         ),
//       );
//     }
//   };
