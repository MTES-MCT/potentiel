import { logger } from '@core/utils';
import { ModificationRequestCancelled } from '@modules/modificationRequest';
import { ModificationRequest, ModificationRequestProjector } from '../modificationRequest.model';
import { ProjectionEnEchec } from '@modules/shared';

export const onModificationRequestCancelled = ModificationRequestProjector.on(
  ModificationRequestCancelled,
  async (évènement, transaction) => {
    try {
      const {
        payload: { modificationRequestId, cancelledBy },
        occurredAt,
      } = évènement;

      await ModificationRequest.update(
        {
          status: 'annulée',
          cancelledBy,
          cancelledOn: occurredAt.getTime(),
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
          `Erreur lors du traitement de l'évènement ModificationRequestCancelled`,
          {
            évènement,
            nomProjection: 'ModificationRequest.ModificationRequestCancelled',
          },
          error,
        ),
      );
    }
  },
);
