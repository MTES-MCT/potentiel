import { ProjectEvent } from '../../projectEvent.model';
import { ProjectEventProjector } from '../../projectEvent.projector';
import { AbandonDemandé } from '../../../../../../modules/demandeModification';
import { ProjectionEnEchec } from '@modules/shared';
import { logger } from '@core/utils';

export default ProjectEventProjector.on(AbandonDemandé, async (évènement, transaction) => {
  const {
    payload: { projetId, demandeAbandonId, autorité },
    occurredAt,
  } = évènement;

  try {
    await ProjectEvent.create(
      {
        projectId: projetId,
        type: 'DemandeAbandon',
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        id: demandeAbandonId,
        payload: {
          statut: 'envoyée',
          autorité,
        },
      },
      { transaction },
    );
  } catch (e) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'événement AbandonDemandé`,
        {
          évènement,
          nomProjection: 'ProjectEventProjector.onAbandonDemandé',
        },
        e,
      ),
    );
  }
});
