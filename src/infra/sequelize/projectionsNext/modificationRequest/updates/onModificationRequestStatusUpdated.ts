import { logger } from '@core/utils';
import { ModificationRequestStatusUpdated } from '@modules/modificationRequest';
import { ModificationRequest } from '../modificationRequest.model';
import { ModificationRequestProjector } from '../modificationRequest.projector';
import { ProjectionEnEchec } from '@modules/shared';

export const onModificationRequestStatusUpdated = ModificationRequestProjector.on(
  ModificationRequestStatusUpdated,
  async (évènement, transaction) => {
    try {
      const {
        payload: { updatedBy, newStatus, modificationRequestId },
        occurredAt,
      } = évènement;

      await ModificationRequest.update(
        {
          status: newStatus,
          respondedOn: occurredAt.getTime(),
          respondedBy: updatedBy,
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
          `Erreur lors du traitement de l'évènement ModificationRequestStatusUpdated`,
          {
            évènement,
            nomProjection: 'ModificationRequest.ModificationRequestStatusUpdated',
          },
          error,
        ),
      );
    }
  },
);
