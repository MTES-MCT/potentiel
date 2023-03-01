import { logger } from '@core/utils';
import { ProjectionEnEchec } from '@modules/shared';
import { DélaiRejeté } from '@modules/demandeModification';
import { ModificationRequest, ModificationRequestProjector } from '../../modificationRequest.model';

export const onDélaiRejeté = ModificationRequestProjector.on(
  DélaiRejeté,
  async (évènement, transaction) => {
    try {
      const {
        payload: { demandeDélaiId, rejetéPar, fichierRéponseId },
        occurredAt,
      } = évènement;

      await ModificationRequest.update(
        {
          status: 'rejetée',
          respondedBy: rejetéPar,
          respondedOn: occurredAt.getTime(),
          versionDate: occurredAt,
          responseFileId: fichierRéponseId,
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
          `Erreur lors du traitement de l'évènement DélaiRejeté`,
          {
            évènement,
            nomProjection: 'ModificationRequest.DélaiRejeté',
          },
          error,
        ),
      );
    }
  },
);
