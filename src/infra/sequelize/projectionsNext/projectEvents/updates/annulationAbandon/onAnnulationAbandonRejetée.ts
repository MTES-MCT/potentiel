import { ProjectEvent, ProjectEventProjector } from '../../projectEvent.model';
import { AnnulationAbandonRejetée } from '../../../../../../modules/demandeModification';
import { ProjectionEnEchec } from '@modules/shared';
import { logger } from '@core/utils';

export default ProjectEventProjector.on(
  AnnulationAbandonRejetée,
  async (évènement, transaction) => {
    const {
      payload: { demandeId },
      occurredAt,
    } = évènement;

    const event = await ProjectEvent.findOne({ where: { id: demandeId }, transaction });

    if (!event) {
      logger.error(
        new ProjectionEnEchec(`L'événement pour la demande n'a pas été retrouvé`, {
          évènement,
          nomProjection: 'ProjectEventProjector.onAnnulationAbandonRejetée',
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
            ...event.payload,
            statut: 'rejetée',
          },
        },
        { where: { id: demandeId }, transaction },
      );
    } catch (e) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'événement AnnulationAbandonRejetée`,
          {
            évènement,
            nomProjection: 'ProjectEventProjector.onAnnulationAbandonRejetée',
          },
          e,
        ),
      );
    }
  },
);
