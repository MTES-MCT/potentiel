import { UniqueEntityID } from '@core/domain'
import { logger } from '@core/utils'
import { ProjectEvent, ProjectEventProjector } from '../projectEvent.model'
import { DonnéesDeRaccordementRenseignées } from '@modules/project'
import { ProjectionEnEchec } from '@modules/shared'

export default ProjectEventProjector.on(
  DonnéesDeRaccordementRenseignées,
  async (évènement, transaction) => {
    const {
      payload: { dateMiseEnService, dateFileAttente, projetId },
      occurredAt,
    } = évènement
    const projectEvent = await ProjectEvent.findOne({
      where: { projectId: projetId, type: 'DateMiseEnService' },
      transaction,
    })

    try {
      await ProjectEvent.upsert(
        {
          id: projectEvent?.id || new UniqueEntityID().toString(),
          type: 'DateMiseEnService',
          valueDate: occurredAt.getTime(),
          eventPublishedAt: occurredAt.getTime(),
          projectId: projetId,
          payload: {
            statut: 'renseignée',
            dateMiseEnService,
            ...(dateFileAttente && { dateFileAttente }),
          },
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
)
