import { UniqueEntityID } from '@core/domain'
import { logger } from '@core/utils'
import { ProjectEvent, ProjectEventProjector } from '../projectEvent.model'
import { DateMiseEnServiceRenseignée } from '@modules/project'
import { ProjectionEnEchec } from '@modules/shared'

export default ProjectEventProjector.on(
  DateMiseEnServiceRenseignée,
  async (évènement, transaction) => {
    const {
      payload: { dateMiseEnService, projetId },
      occurredAt,
    } = évènement
    const projectEvent = await ProjectEvent.findOne({
      where: { projectId: projetId, type: 'DateMiseEnService' },
      transaction,
    })

    if (!projectEvent) {
      try {
        await ProjectEvent.create({
          type: 'DateMiseEnService',
          id: new UniqueEntityID().toString(),
          valueDate: occurredAt.getTime(),
          eventPublishedAt: occurredAt.getTime(),
          projectId: projetId,
          payload: { statut: 'renseignée', dateMiseEnService },
        })
      } catch (error) {
        logger.error(
          new ProjectionEnEchec(
            `Erreur lors du traitement de l'événement DateMiseEnServiceRenseignée: création d'un nouveau project event`,
            {
              évènement,
              nomProjection: 'ProjectEvent.onDateMiseEnServiceRenseignée',
            },
            error
          )
        )
      }
      return
    }

    try {
      await ProjectEvent.update(
        { payload: { statut: 'renseignée', dateMiseEnService } },
        { where: { projectId: projetId, type: 'DateMiseEnService' }, transaction }
      )
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'événement DateMiseEnServiceRenseignée : mise à jour du project event`,
          {
            évènement,
            nomProjection: 'ProjectEvent.onDateMiseEnServiceRenseignée',
          },
          error
        )
      )
    }
  }
)
