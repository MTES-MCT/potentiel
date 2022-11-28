import { logger } from '@core/utils'
import { ProjectGFInvalidées } from '@modules/project'

export const onProjectGFInvalidées = (models) => async (event: ProjectGFInvalidées) => {
  const { ProjectStep } = models
  const { projetId, invalidéesPar } = event.payload
  const instance = await ProjectStep.findOne({
    where: { projectId: projetId, type: 'garantie-financiere' },
  })

  if (!instance) {
    logger.error(
      `Error: onProjectGFInvalidées projection failed to retrieve projectStep from db ${event}`
    )
    return
  }

  const { occurredAt } = event

  Object.assign(instance, {
    status: 'à traiter',
    statusUpdatedOn: occurredAt,
    statusUpdatedBy: invalidéesPar,
  })
  try {
    await instance.save()
  } catch (e) {
    logger.error(e)
    logger.info('Error: onProjectGFInvalidées projection failed to update projectStep :', event)
  }
}
