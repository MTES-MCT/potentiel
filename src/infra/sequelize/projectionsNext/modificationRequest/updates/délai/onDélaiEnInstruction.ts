import { logger } from '@core/utils';
import { ProjectionEnEchec } from '@modules/shared';
import { DélaiEnInstruction } from '@modules/demandeModification';
import { ModificationRequest, ModificationRequestProjector } from '../../modificationRequest.model';

export const onDélaiEnInstruction = ModificationRequestProjector.on(
  DélaiEnInstruction,
  async (évènement, transaction) => {
    try {
      const {
        payload: { demandeDélaiId },
        occurredAt,
      } = évènement;

      await ModificationRequest.update(
        {
          status: 'en instruction',
          versionDate: occurredAt,
        },
        {
          where: {
            id: demandeDélaiId,
          },
          transaction,
        },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement DélaiEnInstruction`,
          {
            évènement,
            nomProjection: 'ModificationRequest.DélaiEnInstruction',
          },
          error,
        ),
      );
    }
  },
);
