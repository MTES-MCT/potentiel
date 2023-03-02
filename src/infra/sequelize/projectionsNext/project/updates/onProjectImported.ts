import { logger } from '@core/utils';
import { ProjectImported } from '@modules/project';
import { ProjectProjector } from '@infra/sequelize';
import { ProjectionEnEchec } from '@modules/shared';

export const onProjectImported = ProjectProjector.on(
  ProjectImported,
  async (évènement, transaction) => {
    try {
      const {} = évènement;
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ProjectImported`,
          {
            évènement,
            nomProjection: 'Project.ProjectImported',
          },
          error,
        ),
      );
    }
  },
);

// export const onProjectImported = (models) => async (event: ProjectImported) => {
//   const { Project } = models;

//   const { projectId, data, potentielIdentifier } = event.payload;

//   try {
//     await Project.create({
//       id: projectId,
//       ...data,
//       evaluationCarboneDeRéférence: data.evaluationCarbone,
//       potentielIdentifier,
//     });
//   } catch (e) {
//     logger.error(e);
//     logger.info('Error: onProjectImported projection failed to update project', event);
//   }
// };
