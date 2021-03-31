import { logger } from '../../../../../core/utils'
import { AppelOffreUpdated } from '../../../../../modules/appelOffre'

export const onAppelOffreUpdated = (models) => async (event: AppelOffreUpdated) => {
  const { AppelOffre } = models
  const instance = await AppelOffre.findByPk(event.payload.appelOffreId)

  if (!instance) {
    logger.error(
      `Error: onAppelOffreUpdated projection failed to retrieve project from db ${event}`
    )
    return
  }

  const {
    payload: { delta },
  } = event

  Object.assign(instance, {
    data: { ...instance.data, ...delta },
  })

  try {
    await instance.save()
  } catch (e) {
    logger.error(e)
    logger.info('Error: onAppelOffreUpdated projection failed to update appel offre :', event)
  }
}
