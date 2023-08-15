import { logger } from '../../../../../../core/utils';
import { ModificationRequest } from '../../modificationRequest.model';
import { ModificationRequestProjector } from '../../modificationRequest.projector';
import { AbandonConfirmé } from '../../../../../../modules/demandeModification';
import { ProjectionEnEchec } from '../../../../../../modules/shared';

export const onAbandonConfirmé = ModificationRequestProjector.on(
  AbandonConfirmé,
  async (évènement, transaction) => {
    try {
      const {
        payload: { demandeAbandonId, confirméPar },
        occurredAt,
      } = évènement;

      await ModificationRequest.update(
        {
          status: 'demande confirmée',
          confirmedBy: confirméPar,
          confirmedOn: occurredAt.getTime(),
          versionDate: occurredAt,
        },
        {
          where: { id: demandeAbandonId },
          transaction,
        },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement AbandonConfirmé`,
          {
            évènement,
            nomProjection: 'ModificationRequest.AbandonConfirmé',
          },
          error,
        ),
      );
    }
  },
);
