import { logger } from '@core/utils';
import { DélaiAnnulé } from '@modules/demandeModification';
import { ProjectionEnEchec } from '@modules/shared';
import { ProjectEvent, ProjectEventProjector } from '../../projectEvent.model';

export default ProjectEventProjector.on(DélaiAnnulé, async (évènement, transaction) => {
  const {
    payload: { demandeDélaiId, annuléPar },
    occurredAt,
  } = évènement;

  const instance = await ProjectEvent.findOne({ where: { id: demandeDélaiId }, transaction });

  if (!instance) {
    logger.error(
      new ProjectionEnEchec(`L'événement pour la demande n'a pas été retrouvé`, {
        évènement,
        nomProjection: 'ProjectEvent.onDélaiAnnulé',
      }),
    );
    return;
  }

  Object.assign(instance, {
    valueDate: occurredAt.getTime(),
    eventPublishedAt: occurredAt.getTime(),
    payload: {
      ...instance.payload,
      statut: 'annulée',
      annuléPar,
    },
  });

  try {
    await instance.save({ transaction });
  } catch (e) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'événement DélaiAnnulé`,
        {
          évènement,
          nomProjection: 'ProjectEvent.onDélaiAnnulé',
        },
        e,
      ),
    );
  }
});
