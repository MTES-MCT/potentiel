import { UniqueEntityID } from '@core/domain'
import { logger } from '@core/utils'
import { ProjectEvent, ProjectEventProjector } from '../projectEvent.model'
import { DonnéesDeRaccordementRenseignées } from '@modules/project'
import { ProjectionEnEchec } from '@modules/shared'

export default ProjectEventProjector.on(
  DonnéesDeRaccordementRenseignées,
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
        await ProjectEvent.create(
          {
            type: 'DateMiseEnService',
            id: new UniqueEntityID().toString(),
            valueDate: occurredAt.getTime(),
            eventPublishedAt: occurredAt.getTime(),
            projectId: projetId,
            payload: { statut: 'renseignée', dateMiseEnService },
          },
          { transaction }
        )
      } catch (error) {
        logger.error(
          new ProjectionEnEchec(
            `Erreur lors du traitement de l'événement DonnéesDeRaccordementRenseignées: création d'un nouveau project event`,
            {
              évènement,
              nomProjection: 'ProjectEvent.onDonnéesDeRaccordementRenseignées',
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
          `Erreur lors du traitement de l'événement DonnéesDeRaccordementRenseignées : mise à jour du project event`,
          {
            évènement,
            nomProjection: 'ProjectEvent.onDonnéesDeRaccordementRenseignées',
          },
          error
        )
      )
    }
  }
)
