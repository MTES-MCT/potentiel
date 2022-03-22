import { logger } from '@core/utils'
import { ProjectCompletionDueDateCancelled } from '@modules/project'

export const onProjectCompletionDueDateCancelled =
  (models) => async (event: ProjectCompletionDueDateCancelled) => {
    const ProjectModel = models.Project
    const projectInstance = await ProjectModel.findByPk(event.payload.projectId)

    if (!projectInstance) {
      logger.error(
        `Error: onProjectCompletionDueDateCancelled projection failed to retrieve project from db': ${event}`
      )
      return
    }

    projectInstance.completionDueOn = 0

    try {
      await projectInstance.save()
    } catch (e) {
      logger.error(e)
      logger.info(
        'Error: onProjectCompletionDueDateCancelled projection failed to update project',
        event
      )
    }
  }
