import { logger } from '../../../../../../core/utils';
import { DélaiEnInstruction } from '../../../../../../modules/demandeModification';
import { ProjectionEnEchec } from '../../../../../../modules/shared';
import { ProjectEvent } from '../../projectEvent.model';
import { ProjectEventProjector } from '../../projectEvent.projector';

export default ProjectEventProjector.on(DélaiEnInstruction, async (évènement, transaction) => {
  const {
    payload: { demandeDélaiId, modifiéPar },
    occurredAt,
  } = évènement;

  const instance = await ProjectEvent.findOne({ where: { id: demandeDélaiId }, transaction });

  if (!instance) {
    logger.error(
      new ProjectionEnEchec(`L'événement pour la demande n'a pas été retrouvé`, {
        évènement,
        nomProjection: 'ProjectEvent.onDélaiEnInstruction',
      }),
    );
    return;
  }

  Object.assign(instance, {
    valueDate: occurredAt.getTime(),
    eventPublishedAt: occurredAt.getTime(),
    payload: {
      ...instance.payload,
      statut: 'en-instruction',
      modifiéPar,
    },
  });

  try {
    await instance.save({ transaction });
  } catch (e) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'événement DélaiEnInstruction`,
        {
          évènement,
          nomProjection: 'ProjectEvent.onDélaiEnInstruction',
        },
        e,
      ),
    );
  }
});
