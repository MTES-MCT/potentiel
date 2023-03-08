import { ProjectEvent } from '../../projectEvent.model';
import { ProjectEventProjector } from '../../projectEvent.projector';
import { ProjectionEnEchec } from '@modules/shared';
import { logger } from '@core/utils';
import { LegacyAbandonSupprimé } from '@modules/project';

export default ProjectEventProjector.on(LegacyAbandonSupprimé, async (évènement, transaction) => {
  const {
    payload: { projetId },
  } = évènement;

  try {
    await ProjectEvent.destroy({
      where: { 'payload.modificationType': 'abandon', projectId: projetId },
      transaction,
    });
  } catch (e) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'événement LegacyAbandonSupprimé`,
        {
          évènement,
          nomProjection: 'ProjectEventProjector.onLegacyAbandonSupprimé',
        },
        e,
      ),
    );
  }
});
