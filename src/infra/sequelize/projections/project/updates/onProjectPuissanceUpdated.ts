import { logger } from '../../../../../core/utils'
import { ProjectPuissanceUpdated } from '../../../../../modules/project/events'

export const onProjectPuissanceUpdated = (models) => async (event: ProjectPuissanceUpdated) => {
  const { projectId, newPuissance } = event.payload
  const { Project } = models
  const projectInstance = await Project.findByPk(projectId)

  if (!projectInstance) {
    logger.error(
      `Error: onProjectPuissanceUpdated projection failed to retrieve project from db: ${event}`
    )
    return
  }

  projectInstance.puissance = newPuissance

  try {
    await projectInstance.save()
  } catch (e) {
    logger.error(e)
    logger.info('Error: onProjectPuissanceUpdated projection failed to update project', event)
  }
}
