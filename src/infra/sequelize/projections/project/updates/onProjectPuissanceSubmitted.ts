import { logger } from '../../../../../core/utils'
import { ProjectPuissanceSubmitted } from '../../../../../modules/project/events'

export const onProjectPuissanceSubmitted = (models) => async (event: ProjectPuissanceSubmitted) => {
  const { projectId, newPuissance } = event.payload
  const ProjectModel = models.Project
  const projectInstance = await ProjectModel.findByPk(projectId)

  if (!projectInstance) {
    logger.error(
      `Error: onProjectPuissanceSubmitted projection failed to retrieve project from db: ${event}`
    )
    return
  }

  projectInstance.puissance = newPuissance

  try {
    await projectInstance.save()
  } catch (e) {
    logger.error(e)
    logger.info('Error: onProjectPuissanceSubmitted projection failed to update project', event)
  }
}
