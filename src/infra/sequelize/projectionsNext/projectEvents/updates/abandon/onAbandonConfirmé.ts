import { ProjectEvent } from '../../projectEvent.model';
import { ProjectEventProjector } from '../../projectEvent.projector';
import { AbandonConfirmé } from '../../../../../../modules/demandeModification';
import { ProjectionEnEchec } from '../../../../../../modules/shared';
import { logger } from '../../../../../../core/utils';

export default ProjectEventProjector.on(AbandonConfirmé, async (évènement, transaction) => {
  const {
    payload: { demandeAbandonId },
    occurredAt,
  } = évènement;

  const abandonEvent = await ProjectEvent.findOne({ where: { id: demandeAbandonId }, transaction });

  if (!abandonEvent) {
    logger.error(
      new ProjectionEnEchec(`L'événement pour la demande n'a pas été retrouvé`, {
        évènement,
        nomProjection: 'ProjectEventProjector.onAbandonConfirmé',
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
          statut: 'demande confirmée',
        },
      },
      { where: { id: demandeAbandonId }, transaction },
    );
  } catch (e) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'événement AbandonConfirmé`,
        {
          évènement,
          nomProjection: 'ProjectEventProjector.onAbandonConfirmé',
        },
        e,
      ),
    );
  }
});
