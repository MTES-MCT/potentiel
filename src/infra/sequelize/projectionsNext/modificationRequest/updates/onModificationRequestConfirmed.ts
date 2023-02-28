import { logger } from '@core/utils';
import { ModificationRequestConfirmed } from '@modules/modificationRequest';
import { ModificationRequest, ModificationRequestProjector } from '@infra/sequelize';
import { ProjectionEnEchec } from '@modules/shared';

export const onModificationRequestConfirmed = ModificationRequestProjector.on(
  ModificationRequestConfirmed,
  async (évènement, transaction) => {
    try {
      const {
        payload: { confirmedBy, modificationRequestId },
        occurredAt,
      } = évènement;

      await ModificationRequest.update(
        {
          status: 'demande confirmée',
          confirmedBy,
          confirmedOn: occurredAt.getTime(),
          versionDate: occurredAt,
        },
        {
          where: {
            id: modificationRequestId,
          },
          transaction,
        },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ModificationRequestConfirmed`,
          {
            évènement,
            nomProjection: 'ModificationRequest.ModificationRequestConfirmed',
          },
          error,
        ),
      );
    }
  },
);
