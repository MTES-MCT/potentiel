import { logger } from '@core/utils';
import { ModificationRequestCancelled } from '@modules/modificationRequest';

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
