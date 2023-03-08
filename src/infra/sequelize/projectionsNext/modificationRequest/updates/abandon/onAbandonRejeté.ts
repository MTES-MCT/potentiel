import { logger } from '@core/utils';
import { ModificationRequest } from '../../modificationRequest.model';
import { ModificationRequestProjector } from '../../modificationRequest.projector';
import { AbandonRejeté } from '@modules/demandeModification';
import { ProjectionEnEchec } from '@modules/shared';

export const onAbandonRejeté = ModificationRequestProjector.on(
  AbandonRejeté,
  async (évènement, transaction) => {
    try {
      const {
        payload: { demandeAbandonId, rejetéPar, fichierRéponseId },
        occurredAt,
      } = évènement;

      await ModificationRequest.update(
        {
          status: 'rejetée',
          respondedOn: occurredAt.getTime(),
          respondedBy: rejetéPar,
          versionDate: occurredAt,
          responseFileId: fichierRéponseId,
        },
        { where: { id: demandeAbandonId }, transaction },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement AbandonRejeté`,
          {
            évènement,
            nomProjection: 'ModificationRequest.AbandonRejeté',
          },
          error,
        ),
      );
    }
  },
);
