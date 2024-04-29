import { logger } from '../../../../../core/utils';
import { ModificationRequestRejected } from '../../../../../modules/modificationRequest';
import { ProjectionEnEchec } from '../../../../../modules/shared';
import { ModificationRequest } from '../modificationRequest.model';
import { ModificationRequestProjector } from '../modificationRequest.projector';

export const onModificationRequestRejected = ModificationRequestProjector.on(
  ModificationRequestRejected,
  async (évènement, transaction) => {
    try {
      const {
        payload: { modificationRequestId, rejectedBy, responseFileId },
        occurredAt,
      } = évènement;

      await ModificationRequest.update(
        {
          status: 'rejetée',
          respondedOn: occurredAt.getTime(),
          respondedBy: rejectedBy,
          versionDate: occurredAt,
          responseFileId,
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
          `Erreur lors du traitement de l'évènement ModificationRequestRejected`,
          {
            évènement,
            nomProjection: 'ModificationRequest.ModificationRequestRejected',
          },
          error,
        ),
      );
    }
  },
);
