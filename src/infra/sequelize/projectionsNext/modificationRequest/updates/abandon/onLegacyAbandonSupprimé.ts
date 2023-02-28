import { logger } from '@core/utils';
import { ModificationRequest, ModificationRequestProjector } from '@infra/sequelize';
import { LegacyAbandonSupprimé } from '@modules/project';
import { ProjectionEnEchec } from '@modules/shared';

export const onLegacyAbandonSupprimé = ModificationRequestProjector.on(
  LegacyAbandonSupprimé,
  async (évènement, transaction) => {
    const {
      payload: { projetId },
    } = évènement;
    try {
      await ModificationRequest.destroy({
        where: { projectId: projetId, type: 'abandon' },
        transaction,
      });
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement AbandonConfirmé`,
          {
            évènement,
            nomProjection: 'ModificationRequest.AbandonConfirmé',
          },
          error,
        ),
      );
    }
  },
);
