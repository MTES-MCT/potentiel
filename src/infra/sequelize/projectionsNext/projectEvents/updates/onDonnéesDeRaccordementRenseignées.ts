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
    const projectEventDateMiseEnService = await ProjectEvent.findOne({
      where: { projectId: projetId, type: 'DateMiseEnService' },
      transaction,
    })

    if (dateMiseEnService) {
      try {
        await ProjectEvent.upsert(
          {
            id: projectEventDateMiseEnService?.id || new UniqueEntityID().toString(),
            type: 'DateMiseEnService',
            valueDate: occurredAt.getTime(),
            eventPublishedAt: occurredAt.getTime(),
            projectId: projetId,
            payload: {
              statut: 'renseignée',
              dateMiseEnService,
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
    }

    if (dateFileAttente) {
      const projectEventDateFileAttente = await ProjectEvent.findOne({
        where: { projectId: projetId, type: 'DateFileAttente' },
        transaction,
      })

      try {
        await ProjectEvent.upsert(
          {
            id: projectEventDateFileAttente?.id || new UniqueEntityID().toString(),
            type: 'DateFileAttente',
            valueDate: occurredAt.getTime(),
            eventPublishedAt: occurredAt.getTime(),
            projectId: projetId,
            payload: {
              dateFileAttente,
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
    }

    return
  }
)
