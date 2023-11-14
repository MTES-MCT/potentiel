import { DélaiAccordéCorrigé } from '../../../../../../modules/demandeModification';
import { logger } from '../../../../../../core/utils';
import { ProjectEvent } from '../../projectEvent.model';
import { ProjectEventProjector } from '../../projectEvent.projector';
import { ProjectionEnEchec } from '../../../../../../modules/shared';

export default ProjectEventProjector.on(DélaiAccordéCorrigé, async (évènement, transaction) => {
  const {
    payload: { demandeDélaiId, corrigéPar, dateAchèvementAccordée },
    occurredAt,
  } = évènement;

  const projectEvent = await ProjectEvent.findOne({ where: { id: demandeDélaiId }, transaction });

  if (!projectEvent) {
    logger.error(
      new ProjectionEnEchec(`Project event non trouvé.`, {
        évènement,
        nomProjection: 'ProjectEvent.onDélaiAccordéCorrigé',
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
          ...projectEvent.payload,
          statut: 'accordée-corrigée',
          accordéPar: corrigéPar,
          dateAchèvementAccordée: new Date(dateAchèvementAccordée).toISOString(),
        },
      },
      { where: { id: demandeDélaiId }, transaction },
    );
  } catch (e) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'événement DélaiAccordéCorrigé`,
        {
          évènement,
          nomProjection: 'ProjectEvent.onDélaiAccordéCorrigé',
        },
        e,
      ),
    );
  }
});
