import { logger } from '@core/utils'
import { PeriodeCreated } from '@modules/appelOffre'

export const onPeriodeCreated = (models) => async (event: PeriodeCreated) => {
  const { Periode } = models
  const {
    payload: { appelOffreId, periodeId, data },
  } = event

  try {
    await Periode.create({
      appelOffreId,
      periodeId,
      data,
    })
  } catch (e) {
    logger.info('Error: onPeriodeCreated projection failed to update periode :', event)
    logger.error(e)
  }
}
