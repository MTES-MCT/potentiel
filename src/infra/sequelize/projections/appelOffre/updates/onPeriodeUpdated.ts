import { logger } from '@core/utils'
import { PeriodeUpdated } from '@modules/appelOffre'
import { ProjectionEnEchec } from '@modules/shared'

export const onPeriodeUpdated = (models) => async (event: PeriodeUpdated) => {
  const { Periode } = models
  const {
    payload: { appelOffreId, periodeId, delta },
  } = event

  const instance = await Periode.findOne({ where: { appelOffreId, periodeId } })

  if (!instance) {
    logger.error(
      new ProjectionEnEchec(`La période à mettre à jour n'existe pas`, {
        nomProjection: 'onPeriodeUpdated',
        evenement: event,
      })
    )
    return
  }

  Object.assign(instance, {
    data: { ...instance.data, ...delta },
  })

  try {
    await instance.save()
  } catch (e) {
    logger.info('Error: onPeriodeUpdated projection failed to update periode :', event)
    logger.error(e)
  }
}
