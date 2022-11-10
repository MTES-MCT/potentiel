import { logger } from '@core/utils'
import { Projections } from '@infra/sequelize/models'
import { DonnéesDeRaccordementRenseignées } from '@modules/project'
import { ProjectionEnEchec } from '@modules/shared'

type onDonnéesDeRaccordementRenseignées = (
  projections: Projections
) => (événement: DonnéesDeRaccordementRenseignées) => Promise<void>

export const onDonnéesDeRaccordementRenseignées: onDonnéesDeRaccordementRenseignées =
  ({ Project }) =>
  async (évènement) => {
    const {
      payload: { projetId, dateMiseEnService, dateFileAttente },
    } = évènement

    const projectInstance = await Project.findByPk(projetId)

    if (!projectInstance) {
      logger.error(
        new ProjectionEnEchec(
          'Erreur dans la projection onDateMiseEnServiceRenseingée : impossible de récupérer le projet de la db',
          {
            nomProjection: 'onDonnéesDeRaccordementRenseignées',
            évènement,
          }
        )
      )
      return
    }

    try {
      await Project.update(
        {
          dateMiseEnService,
          dateFileAttente,
        },
        {
          where: { id: projetId },
        }
      )
    } catch (cause) {
      logger.error(
        new ProjectionEnEchec(
          'Erreur lors de la projection du renseignement de la date de mise en service',
          {
            nomProjection: 'onDonnéesDeRaccordementRenseignées',
            évènement,
          },
          cause
        )
      )
    }
  }
