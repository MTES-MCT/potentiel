import { logger } from '@core/utils';
import { ModificationRequest } from '../../modificationRequest.model';
import { ModificationRequestProjector } from '../../modificationRequest.projector';
import { AbandonAccordé } from '@modules/demandeModification';
import { ProjectionEnEchec } from '@modules/shared';

export const onAbandonAccordé = ModificationRequestProjector.on(
  AbandonAccordé,
  async (évènement, transaction) => {
    try {
      const {
        payload: { demandeAbandonId, accordéPar, fichierRéponseId },
        occurredAt,
      } = évènement;

      await ModificationRequest.update(
        {
          status: 'acceptée',
          respondedOn: occurredAt.getTime(),
          respondedBy: accordéPar,
          versionDate: occurredAt,
          responseFileId: fichierRéponseId,
        },
        {
          where: { id: demandeAbandonId },
          transaction,
        },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement AbandonAccordé`,
          {
            évènement,
            nomProjection: 'ModificationRequest.AbandonAccordé',
          },
          error,
        ),
      );
    }
  },
);
