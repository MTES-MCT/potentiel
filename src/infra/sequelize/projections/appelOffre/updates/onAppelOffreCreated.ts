import { logger } from '../../../../../core/utils'
import { AppelOffreCreated } from '../../../../../modules/appelOffre'

export const onAppelOffreCreated = (models) => async (event: AppelOffreCreated) => {
  const { AppelOffre } = models

  const {
    payload: { appelOffreId, data },
  } = event
  try {
    await AppelOffre.create({
      id: appelOffreId,
      data,
    })
  } catch (e) {
    logger.error(e)
    logger.info('Error: onAppelOffreCreated projection failed to create appel offre :', event)
  }
}
