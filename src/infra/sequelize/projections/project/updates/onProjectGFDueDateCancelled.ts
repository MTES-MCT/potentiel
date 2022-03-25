import { logger } from '@core/utils'
import { ProjectGFDueDateCancelled } from '@modules/project'

export const onProjectGFDueDateCancelled = (models) => async (event: ProjectGFDueDateCancelled) => {
  const { Project } = models
  const projectInstance = await Project.findByPk(event.payload.projectId)

  if (!projectInstance) {
    logger.error(
      `Error: onProjectGFDueDateCancelled projection failed to retrieve project from db': ${event}`
    )
    return
  }

  projectInstance.garantiesFinancieresDueOn = 0

  try {
    await projectInstance.save()
  } catch (e) {
    logger.error(e)
    logger.info('Error: onProjectGFDueDateCancelled projection failed to update project', event)
  }
}
