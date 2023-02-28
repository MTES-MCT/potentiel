import { logger } from '@core/utils';
import { ModificationRequestInstructionStarted } from '@modules/modificationRequest';
import { ModificationRequest, ModificationRequestProjector } from '@infra/sequelize';
import { ProjectionEnEchec } from '@modules/shared';

export const onModificationRequestInstructionStarted = ModificationRequestProjector.on(
  ModificationRequestInstructionStarted,
  async (évènement, transaction) => {
    try {
      const {
        payload: { modificationRequestId },
      } = évènement;

      await ModificationRequest.update(
        {
          status: 'en instruction',
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
          `Erreur lors du traitement de l'évènement ModificationRequestInstructionStarted`,
          {
            évènement,
            nomProjection: 'ModificationRequest.ModificationRequestInstructionStarted',
          },
          error,
        ),
      );
    }
  },
);
