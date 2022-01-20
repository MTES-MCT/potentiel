import { logger } from '@core/utils'
import { ProjectStepStatusUpdated } from '@modules/project'

export const onProjectStepStatusUpdated = (models) => async (event: ProjectStepStatusUpdated) => {
  const { ProjectStep } = models
  const { projectStepId } = event.payload
  const instance = await ProjectStep.findByPk(projectStepId)

  if (!instance) {
    logger.error(
      `Error: onProjectStepStatusUpdated projection failed to retrieve projectStep from db ${event}`
    )
    return
  }

  const {
    occurredAt,
    payload: { statusUpdatedBy: updatedBy, newStatus },
  } = event

  Object.assign(instance, {
    status: newStatus,
    statusUpdatedOn: occurredAt,
    statusUpdatedBy: updatedBy,
  })
  try {
    await instance.save()
  } catch (e) {
    logger.error(e)
    logger.info(
      'Error: onProjectStepStatusUpdated projection failed to update projectStep :',
      event
    )
  }
}
