import { logger } from '../../../../../core/utils';
import { ModificationRequestAccepted } from '../../../../../modules/modificationRequest';
import { ModificationRequest } from '../modificationRequest.model';
import { ModificationRequestProjector } from '../modificationRequest.projector';
import { ProjectionEnEchec } from '../../../../../modules/shared';

export const onModificationRequestAccepted = ModificationRequestProjector.on(
  ModificationRequestAccepted,
  async (évènement, transaction) => {
    try {
      const {
        payload: { modificationRequestId, acceptedBy, responseFileId, params },
        occurredAt,
      } = évènement;

      await ModificationRequest.update(
        {
          status: 'acceptée',
          respondedOn: occurredAt.getTime(),
          respondedBy: acceptedBy,
          versionDate: occurredAt,
          responseFileId: responseFileId || undefined,
          acceptanceParams: params as any, // TODO: params était initialement dans l'ancienne projection typé en any... A fix dans une prochaine PR
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
