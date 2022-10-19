import { logger } from '@core/utils'
import { Projections } from '@infra/sequelize/models'
import { DateDeMiseEnServiceRenseignée } from '@modules/project'
import { ProjectionEnEchec } from '@modules/shared'

type OnDateDeMiseEnServiceRenseignée = (
  projections: Projections
) => (événement: DateDeMiseEnServiceRenseignée) => Promise<void>

export const onDateDeMiseEnServiceRenseignée: OnDateDeMiseEnServiceRenseignée =
  ({ Project }) =>
  async (évènement) => {
    const {
      payload: { projetId, dateDeMiseEnService },
    } = évènement

    const projectInstance = await Project.findByPk(projetId)
    console.log('project instance', projectInstance)
    if (!projectInstance) {
      logger.error(
        `Error: onDateDeMiseEnServiceRenseignée projection failed to retrieve project from db`
      )
      return
    }
    console.log('look im here')
    try {
      await Project.update(
        {
          dateDeMiseEnService,
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
            nomProjection: 'onDateDeMiseEnServiceRenseignée',
            évènement,
          },
          cause
        )
      )
    }
  }
