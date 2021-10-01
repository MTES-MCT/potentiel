import { logger } from '../../../../../core/utils'
import { ProjectImported } from '../../../../../modules/project/events'

export const onProjectImported = (models) => async (event: ProjectImported) => {
  const { Project } = models

  const { projectId, data } = event.payload

  try {
    await Project.create({
      id: projectId,
      ...data,
    })
  } catch (e) {
    logger.error(e)
    logger.info('Error: onProjectImported projection failed to update project', event)
  }
}
