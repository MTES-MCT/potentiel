import { logger } from '@core/utils';
import { ModificationRequest } from '../../modificationRequest.model';
import { ModificationRequestProjector } from '../../modificationRequest.projector';
import { AbandonAnnulé } from '@modules/demandeModification';
import { ProjectionEnEchec } from '@modules/shared';

export const onAbandonAnnulé = ModificationRequestProjector.on(
  AbandonAnnulé,
  async (évènement, transaction) => {
    try {
      const {
        payload: { demandeAbandonId, annuléPar },
        occurredAt,
      } = évènement;

      await ModificationRequest.update(
        {
          status: 'annulée',
          cancelledBy: annuléPar,
          cancelledOn: occurredAt.getTime(),
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
          `Erreur lors du traitement de l'évènement AbandonAnnulé`,
          {
            évènement,
            nomProjection: 'ModificationRequest.AbandonAnnulé',
          },
          error,
        ),
      );
    }
  },
);
