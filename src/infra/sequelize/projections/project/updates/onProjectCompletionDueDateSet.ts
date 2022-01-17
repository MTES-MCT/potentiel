import { logger } from '@core/utils'
import { ProjectCompletionDueDateSet } from '@modules/project'

export const onProjectCompletionDueDateSet = (models) => async (
  event: ProjectCompletionDueDateSet
) => {
  const ProjectModel = models.Project
  const projectInstance = await ProjectModel.findByPk(event.payload.projectId)

  if (!projectInstance) {
    logger.error(
      `Error: onProjectCompletionDueDateSet projection failed to retrieve project from db': ${event}`
    )
    return
  }

  projectInstance.completionDueOn = event.payload.completionDueOn

  try {
    await projectInstance.save()
  } catch (e) {
    logger.error(e)
    logger.info('Error: onProjectCompletionDueDateSet projection failed to update project', event)
  }
}
