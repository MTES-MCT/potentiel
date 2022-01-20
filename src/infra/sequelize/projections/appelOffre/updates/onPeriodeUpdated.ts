import { logger } from '@core/utils'
import { PeriodeUpdated } from '@modules/appelOffre'

export const onPeriodeUpdated = (models) => async (event: PeriodeUpdated) => {
  const { Periode } = models
  const {
    payload: { appelOffreId, periodeId, delta },
  } = event

  const instance = await Periode.findOne({ where: { appelOffreId, periodeId } })

  if (!instance) {
    logger.error(
      `Error: onPeriodeUpdated projection failed to retrieve project from db ${{
        appelOffreId,
        periodeId,
      }}`
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
