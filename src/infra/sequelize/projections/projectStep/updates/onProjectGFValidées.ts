import { logger } from '@core/utils'
import { ProjectGFValidées } from '@modules/project'

export const onProjectGFValidées = (models) => async (event: ProjectGFValidées) => {
  const { ProjectStep } = models
  const { projetId, validéesPar } = event.payload
  const instance = await ProjectStep.findOne({
    where: { projectId: projetId, type: 'garantie-financiere' },
  })

  if (!instance) {
    logger.error(
      `Error: onProjectGFValidées projection failed to retrieve projectStep from db ${event}`
    )
    return
  }

  const { occurredAt } = event

  Object.assign(instance, {
    status: 'validé',
    statusUpdatedOn: occurredAt,
    statusUpdatedBy: validéesPar,
  })
  try {
    await instance.save()
  } catch (e) {
    logger.error(e)
    logger.info('Error: onProjectGFValidées projection failed to update projectStep :', event)
  }
}
