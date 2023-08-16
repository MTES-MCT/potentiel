import { logger } from '../../../../../../core/utils';
import { ModificationRequest } from '../../modificationRequest.model';
import { ModificationRequestProjector } from '../../modificationRequest.projector';
import { ConfirmationAbandonDemandée } from '../../../../../../modules/demandeModification';
import { ProjectionEnEchec } from '../../../../../../modules/shared';

export const onConfirmationAbandonDemandée = ModificationRequestProjector.on(
  ConfirmationAbandonDemandée,
  async (évènement, transaction) => {
    try {
      const {
        payload: { demandeAbandonId, demandéePar, fichierRéponseId },
        occurredAt,
      } = évènement;

      await ModificationRequest.update(
        {
          status: 'en attente de confirmation',
          confirmationRequestedBy: demandéePar,
          confirmationRequestedOn: occurredAt.getTime(),
          versionDate: occurredAt,
          responseFileId: fichierRéponseId,
        },
        { where: { id: demandeAbandonId }, transaction },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ConfirmationAbandonDemandée`,
          {
            évènement,
            nomProjection: 'ModificationRequest.ConfirmationAbandonDemandée',
          },
          error,
        ),
      );
    }
  },
);
