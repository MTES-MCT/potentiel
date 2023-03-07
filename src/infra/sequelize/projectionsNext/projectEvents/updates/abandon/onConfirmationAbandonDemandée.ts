import { ProjectEvent } from '../../projectEvent.model';
import { ProjectEventProjector } from '../../projectEvent.projector';
import { ConfirmationAbandonDemandée } from '../../../../../../modules/demandeModification';
import { ProjectionEnEchec } from '@modules/shared';
import { logger } from '@core/utils';

export default ProjectEventProjector.on(
  ConfirmationAbandonDemandée,
  async (évènement, transaction) => {
    const {
      payload: { demandeAbandonId },
      occurredAt,
    } = évènement;

    const abandonEvent = await ProjectEvent.findOne({
      where: { id: demandeAbandonId },
      transaction,
    });

    if (!abandonEvent) {
      logger.error(
        new ProjectionEnEchec(`L'événement pour la demande n'a pas été retrouvé`, {
          évènement,
          nomProjection: 'ProjectEventProjector.onConfirmationAbandonDemandée',
        }),
      );
      return;
    }

    try {
      await ProjectEvent.update(
        {
          valueDate: occurredAt.getTime(),
          eventPublishedAt: occurredAt.getTime(),
          payload: {
            ...abandonEvent.payload,
            statut: 'en attente de confirmation',
          },
        },
        { where: { id: demandeAbandonId }, transaction },
      );
    } catch (e) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'événement ConfirmationAbandonDemandée`,
          {
            évènement,
            nomProjection: 'ProjectEventProjector.onConfirmationAbandonDemandée',
          },
          e,
        ),
      );
    }
  },
);
