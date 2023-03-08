import { logger } from '@core/utils';
import { LegacyAbandonSupprimé } from '@modules/project';
import { Project } from '../project.model';
import { ProjectProjector } from '../project.projector';
import { ProjectionEnEchec } from '@modules/shared';

export const onLegacyAbandonSupprimé = ProjectProjector.on(
  LegacyAbandonSupprimé,
  async (évènement, transaction) => {
    try {
      const {
        payload: { dcrDueOn, completionDueOn, projetId },
      } = évènement;
      await Project.update(
        {
          abandonedOn: 0,
          dcrDueOn,
          completionDueOn,
        },
        {
          where: { id: projetId },
          transaction,
        },
      );
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
