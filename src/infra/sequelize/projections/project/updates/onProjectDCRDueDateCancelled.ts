import { logger } from '@core/utils'
import { ProjectDCRDueDateCancelled } from '@modules/project'

export const onProjectDCRDueDateCancelled =
  (models) => async (event: ProjectDCRDueDateCancelled) => {
    const { Project } = models
    const projectInstance = await Project.findByPk(event.payload.projectId)

    if (!projectInstance) {
      logger.error(
        `Error: onProjectDCRDueDateCancelled projection failed to retrieve project from db': ${event}`
      )
      return
    }

    projectInstance.dcrDueOn = 0

    try {
      await projectInstance.save()
    } catch (e) {
      logger.error(e)
      logger.info('Error: onProjectDCRDueDateCancelled projection failed to update project', event)
    }
  }
