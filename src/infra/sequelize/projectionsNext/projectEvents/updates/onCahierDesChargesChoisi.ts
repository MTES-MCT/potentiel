import { UniqueEntityID } from '@core/domain';
import { logger } from '@core/utils';
import { CahierDesChargesChoisi } from '@modules/project';
import { ProjectionEnEchec } from '@modules/shared';
import { ProjectEvent } from '../projectEvent.model';
import { ProjectEventProjector } from '../projectEvent.projector';

export default ProjectEventProjector.on(CahierDesChargesChoisi, async (évènement, transaction) => {
  const { payload } = évènement;
  const { projetId, choisiPar, type } = payload;

  try {
    await ProjectEvent.create(
      {
        id: new UniqueEntityID().toString(),
        projectId: projetId,
        type: 'CahierDesChargesChoisi',
        payload: {
          choisiPar,
          type,
          ...(type === 'modifié' && { paruLe: payload.paruLe, alternatif: payload.alternatif }),
        },
        valueDate: évènement.occurredAt.getTime(),
        eventPublishedAt: évènement.occurredAt.getTime(),
      },
      { transaction },
    );
  } catch (error) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'évènement CahierDesChargesChoisi (projectEvent.update)`,
        {
          évènement,
          nomProjection: 'ProjectEvent.onCahierDesChargesChoisi',
        },
        error,
      ),
    );
  }
});
