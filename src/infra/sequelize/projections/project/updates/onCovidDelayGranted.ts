import { logger } from '@core/utils'
import { CovidDelayGranted } from '@modules/project'

export const onCovidDelayGranted = (models) => async (event: CovidDelayGranted) => {
  const { projectId, completionDueOn } = event.payload
  const { Project } = models
  const projectInstance = await Project.findByPk(projectId)

  if (!projectInstance) {
    logger.error(
      `Error: onCovidDelayGranted projection failed to retrieve project from db: ${event}`
    )
    return
  }

  projectInstance.completionDueOn = completionDueOn

  try {
    await projectInstance.save()
  } catch (e) {
    logger.error(e)
    logger.info('Error: onCovidDelayGranted projection failed to update project', event)
  }
}
