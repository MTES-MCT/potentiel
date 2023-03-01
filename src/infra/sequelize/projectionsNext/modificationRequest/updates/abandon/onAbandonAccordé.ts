import { logger } from '@core/utils';
import { ModificationRequest, ModificationRequestProjector } from '../../modificationRequest.model';
import { AbandonAccordé } from '@modules/demandeModification';
import { ProjectionEnEchec } from '@modules/shared';

export const onAbandonAccordé = ModificationRequestProjector.on(
  AbandonAccordé,
  async (évènement, transaction) => {
    const {
      payload: { demandeAbandonId, accordéPar, fichierRéponseId },
      occurredAt,
    } = évènement;

    try {
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
