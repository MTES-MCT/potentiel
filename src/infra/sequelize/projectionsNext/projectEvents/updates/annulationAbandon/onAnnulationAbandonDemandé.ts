import { ProjectEvent } from '../../projectEvent.model';
import { ProjectEventProjector } from '../../projectEvent.projector';
import { AnnulationAbandonDemandée } from '../../../../../../modules/demandeModification';
import { ProjectionEnEchec } from '../../../../../../modules/shared';
import { logger } from '../../../../../../core/utils';

export default ProjectEventProjector.on(
  AnnulationAbandonDemandée,
  async (évènement, transaction) => {
    const {
      payload: { projetId, demandeId },
      occurredAt,
    } = évènement;

    try {
      await ProjectEvent.create(
        {
          projectId: projetId,
          type: 'DemandeAnnulationAbandon',
          valueDate: occurredAt.getTime(),
          eventPublishedAt: occurredAt.getTime(),
          id: demandeId,
          payload: {
            statut: 'envoyée',
          },
        },
        { transaction },
      );
    } catch (e) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'événement AnnulationAbandonDemandée`,
          {
            évènement,
            nomProjection: 'ProjectEventProjector.AnnulationAbandonDemandée',
          },
          e,
        ),
      );
    }
  },
);
