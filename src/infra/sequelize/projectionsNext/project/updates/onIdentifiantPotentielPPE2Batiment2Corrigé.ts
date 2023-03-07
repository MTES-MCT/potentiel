import { logger } from '@core/utils';
import { IdentifiantPotentielPPE2Batiment2Corrigé } from '@modules/project';
import { Project } from '../project.model';
import { ProjectProjector } from '../project.projector';
import { ProjectionEnEchec } from '@modules/shared';

export const onIdentifiantPotentielPPE2Batiment2Corrigé = ProjectProjector.on(
  IdentifiantPotentielPPE2Batiment2Corrigé,
  async (évènement, transaction) => {
    try {
      const {
        payload: { projectId, nouvelIdentifiant },
      } = évènement;
      await Project.update(
        {
          potentielIdentifier: nouvelIdentifiant,
        },
        {
          where: { id: projectId },
          transaction,
        },
      );
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
