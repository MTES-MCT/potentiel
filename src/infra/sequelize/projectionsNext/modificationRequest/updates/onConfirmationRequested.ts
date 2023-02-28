import { logger } from '@core/utils';
import { ConfirmationRequested } from '@modules/modificationRequest';
import { ModificationRequest, ModificationRequestProjector } from '@infra/sequelize';
import { ProjectionEnEchec } from '@modules/shared';

export default ModificationRequestProjector.on(
  ConfirmationRequested,
  async (évènement, transaction) => {
    try {
      const {
        payload: { modificationRequestId, responseFileId, confirmationRequestedBy },
        occurredAt,
      } = évènement;

      await ModificationRequest.update(
        {
          status: 'en attente de confirmation',
          responseFileId,
          confirmationRequestedBy,
          confirmationRequestedOn: occurredAt.getTime(),
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
          `Erreur lors du traitement de l'évènement ConfirmationRequested`,
          {
            évènement,
            nomProjection: 'ModificationRequest.ConfirmationRequested',
          },
          error,
        ),
      );
    }
  },
);
