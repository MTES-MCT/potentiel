import { logger } from '@core/utils';
import { AppelOffreProjetModifié } from '@modules/project';
import { ProjectionEnEchec } from '@modules/shared';
import { Project } from '../project.model';
import { ProjectProjector } from '../project.projector';

export const onAppelOffreProjetModifié = ProjectProjector.on(
  AppelOffreProjetModifié,
  async (évènement, transaction) => {
    try {
      const {
        payload: { projectId, appelOffreId },
      } = évènement;
      await Project.update(
        {
          appelOffreId,
        },
        {
          where: {
            id: projectId,
          },
          transaction,
        },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement AppelOffreProjetModifié`,
          {
            évènement,
            nomProjection: 'Project.AppelOffreProjetModifié',
          },
          error,
        ),
      );
    }
  },
);
