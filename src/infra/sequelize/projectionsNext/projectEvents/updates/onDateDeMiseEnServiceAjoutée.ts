import { logger } from '@core/utils'
import { DateDeMiseEnServiceAjoutée } from '@modules/project'
import { ProjectionEnEchec } from '@modules/shared'
import { ProjectEvent, ProjectEventProjector } from '../projectEvent.model'

export default ProjectEventProjector.on(
  DateDeMiseEnServiceAjoutée,
  async (évènement, transaction) => {
    const {
      payload: { projetId, nouvelleDateDeMiseEnService },
      occurredAt,
      id,
    } = évènement

    try {
      ProjectEvent.create(
        {
          projectId: projetId,
          type: 'DateDeMiseEnServiceAjoutée',
          valueDate: occurredAt.getTime(),
          eventPublishedAt: occurredAt.getTime(),
          id,
          payload: { nouvelleDateDeMiseEnService },
        },
        { transaction }
      )
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'événement DateDeMiseEnServiceAjoutée`,
          {
            évènement,
            nomProjection: 'ProjectEventProjector.onDateDeMiseEnServiceAjoutée',
          },
          error
        )
      )
    }
  }
)
