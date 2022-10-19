import { logger } from '@core/utils'
import { Projections } from '@infra/sequelize/models'
import { DateMiseEnServiceRenseignée } from '@modules/project'
import { ProjectionEnEchec } from '@modules/shared'

type OnDateMiseEnServiceRenseignée = (
  projections: Projections
) => (événement: DateMiseEnServiceRenseignée) => Promise<void>

export const onDateMiseEnServiceRenseignée: OnDateMiseEnServiceRenseignée =
  ({ Project }) =>
  async (évènement) => {
    const {
      payload: { projetId, dateMiseEnService },
    } = évènement

    const projectInstance = await Project.findByPk(projetId)

    if (!projectInstance) {
      logger.error(
        new ProjectionEnEchec(
          'Erreur dans la projection onDateMiseEnServiceRenseingée : impossible de récupérer le projet de la db',
          {
            nomProjection: 'onDateMiseEnServiceRenseignée',
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
            nomProjection: 'onDateMiseEnServiceRenseignée',
            évènement,
          },
          cause
        )
      )
    }
  }
