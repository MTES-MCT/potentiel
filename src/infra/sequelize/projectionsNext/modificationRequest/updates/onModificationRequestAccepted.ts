import { logger } from '@core/utils';
import { ModificationRequestAccepted } from '@modules/modificationRequest';
import { ModificationRequestProjector } from '@infra/sequelize';
import { ProjectionEnEchec } from '@modules/shared';

export default ModificationRequestProjector.on(
  ModificationRequestAccepted,
  async (évènement, transaction) => {
    try {
      const {} = évènement;
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ModificationRequestAccepted`,
          {
            évènement,
            nomProjection: 'ModificationRequest.ModificationRequestAccepted',
          },
          error,
        ),
      );
    }
  },
);

export const onModificationRequestAccepted =
  (models) => async (event: ModificationRequestAccepted) => {
    const ModificationRequestModel = models.ModificationRequest;
    const instance = await ModificationRequestModel.findByPk(event.payload.modificationRequestId);

    if (!instance) {
      logger.error(
        `Error: onModificationRequestAccepted projection failed to retrieve project from db ${event}`,
      );
      return;
    }

    const {
      occurredAt,
      payload: { acceptedBy, responseFileId, params },
    } = event;

    Object.assign(instance, {
      status: 'acceptée',
      respondedOn: occurredAt.getTime(),
      respondedBy: acceptedBy,
      versionDate: occurredAt,
      responseFileId: responseFileId || undefined,
      acceptanceParams: params,
    });

    try {
      await instance.save();
    } catch (e) {
      logger.error(e);
      logger.info(
        'Error: onModificationRequestAccepted projection failed to update project :',
        event,
      );
    }
  };
