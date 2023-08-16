import { ProjectEvent } from '../../projectEvent.model';
import { ProjectEventProjector } from '../../projectEvent.projector';
import { AnnulationAbandonAnnulée } from '../../../../../../modules/demandeModification';
import { ProjectionEnEchec } from '../../../../../../modules/shared';
import { logger } from '../../../../../../core/utils';

export default ProjectEventProjector.on(
  AnnulationAbandonAnnulée,
  async (évènement, transaction) => {
    const {
      payload: { demandeId },
      occurredAt,
    } = évènement;

    const abandonEvent = await ProjectEvent.findOne({
      where: { id: demandeId },
      transaction,
    });

    if (!abandonEvent) {
      logger.error(
        new ProjectionEnEchec(`L'événement pour la demande n'a pas été retrouvé`, {
          évènement,
          nomProjection: 'ProjectEventProjector.onAnnulationAbandonAnnulée',
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
            statut: 'annulée',
          },
        },
        { where: { id: demandeId }, transaction },
      );
    } catch (e) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'événement AnnulationAbandonAnnulée`,
          {
            évènement,
            nomProjection: 'ProjectEventProjector.onAnnulationAbandonAnnulée',
          },
          e,
        ),
      );
    }
  },
);
