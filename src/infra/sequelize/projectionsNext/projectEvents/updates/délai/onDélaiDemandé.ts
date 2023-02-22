import { logger } from '@core/utils';
import { DélaiDemandé } from '@modules/demandeModification';
import { ProjectionEnEchec } from '@modules/shared';
import { ProjectEvent, ProjectEventProjector } from '../../projectEvent.model';

export default ProjectEventProjector.on(DélaiDemandé, async (évènement, transaction) => {
  const {
    payload: { demandeDélaiId, projetId, autorité, dateAchèvementDemandée, porteurId },
    occurredAt,
  } = évènement;

  const demandeDélai = await ProjectEvent.findOne({
    where: { id: demandeDélaiId, type: 'DemandeDélai' },
    transaction,
  });

  if (demandeDélai) {
    try {
      await ProjectEvent.update(
        {
          payload: {
            statut: 'envoyée',
            autorité,
            dateAchèvementDemandée: dateAchèvementDemandée.toISOString(),
            demandeur: porteurId,
          },
        },
        { where: { id: demandeDélaiId }, transaction },
      );
    } catch (e) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'événement DélaiDemandé (projectEvent.update)`,
          {
            évènement,
            nomProjection: 'ProjectEvent.onDélaiDemandé',
          },
          e,
        ),
      );
    }
    return;
  }

  try {
    await ProjectEvent.create(
      {
        id: demandeDélaiId,
        projectId: projetId,
        type: 'DemandeDélai',
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        payload: {
          statut: 'envoyée',
          autorité,
          dateAchèvementDemandée: dateAchèvementDemandée.toISOString(),
          demandeur: porteurId,
        },
      },
      { transaction },
    );
  } catch (e) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'événement DélaiDemandé (projectEvent.create)`,
        {
          évènement,
          nomProjection: 'ProjectEvent.onDélaiDemandé',
        },
        e,
      ),
    );
  }
});
