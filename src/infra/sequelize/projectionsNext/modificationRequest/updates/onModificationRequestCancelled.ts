import { logger } from '@core/utils';
import { ModificationRequestCancelled } from '@modules/modificationRequest';
import { ModificationRequestProjector } from '@infra/sequelize';
import { ProjectionEnEchec } from '@modules/shared';

export default ModificationRequestProjector.on(
  ModificationRequestCancelled,
  async (évènement, transaction) => {
    try {
      const {} = évènement;
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

export const onModificationRequestCancelled =
  (models) =>
  async ({
    occurredAt,
    payload: { modificationRequestId, cancelledBy },
  }: ModificationRequestCancelled) => {
    const { ModificationRequest } = models;

    try {
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
        },
      );
    } catch (e) {
      logger.error(e);
      logger.info(
        'Error: onModificationRequestCancelled projection failed to update modification request :',
        event,
      );
    }
  };
