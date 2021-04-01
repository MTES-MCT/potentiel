import { logger } from '../../../../../core/utils'
import { ProjectStepStatusUpdated } from '../../../../../modules/project/events'

export const onProjectStepStatusUpdated = (models) => async (event: ProjectStepStatusUpdated) => {
  const ProjectStepModel = models.ProjectStep
  const { projectStepId } = event.payload
  const instance = await ProjectStepModel.findByPk(projectStepId)

  if (!instance) {
    logger.error(
      `Error: onProjectStepStatusUpdated projection failed to retrieve projectStep from db ${event}`
    )
    return
  }

  const {
    occurredAt,
    payload: { updatedBy, newStatus },
  } = event

  Object.assign(instance, {
    status: newStatus,
    statusSubmittedAt: occurredAt,
    statusSubmittedBy: updatedBy,
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
