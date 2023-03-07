import { logger } from '@core/utils';
import { ModificationRequest } from '../../modificationRequest.model';
import { ModificationRequestProjector } from '../../modificationRequest.projector';
import { LegacyAbandonSupprimé } from '@modules/project';
import { ProjectionEnEchec } from '@modules/shared';

export const onLegacyAbandonSupprimé = ModificationRequestProjector.on(
  LegacyAbandonSupprimé,
  async (évènement, transaction) => {
    try {
      const {
        payload: { projetId },
      } = évènement;

      await ModificationRequest.destroy({
        where: { projectId: projetId, type: 'abandon' },
        transaction,
      });
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement LegacyAbandonSupprimé`,
          {
            évènement,
            nomProjection: 'ModificationRequest.LegacyAbandonSupprimé',
          },
          error,
        ),
      );
    }
  },
);
