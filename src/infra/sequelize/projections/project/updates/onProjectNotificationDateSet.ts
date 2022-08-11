import { logger } from '@core/utils'
import { ProjectNotificationDateSet, ProjectNotified } from '@modules/project'

export const onProjectNotificationDateSet =
  (models) => async (event: ProjectNotificationDateSet | ProjectNotified) => {
    const ProjectModel = models.Project
    const projectInstance = await ProjectModel.findByPk(event.payload.projectId)

    if (!projectInstance) {
      logger.error(
        `Error: onProjectNotificationDateSet projection failed to retrieve project from db: ${event}`
      )
      return
    }

    // update notifiedOn
    projectInstance.notifiedOn = event.payload.notifiedOn

    try {
      await projectInstance.save()
    } catch (e) {
      logger.error(e)
      logger.info('Error: onProjectNotificationDateSet projection failed to update project', event)
    }
  }
