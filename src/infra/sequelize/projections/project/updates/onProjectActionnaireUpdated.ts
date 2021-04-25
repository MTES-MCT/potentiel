import { logger } from '../../../../../core/utils'
import { ProjectActionnaireUpdated } from '../../../../../modules/project/events'

export const onProjectActionnaireUpdated = (models) => async (event: ProjectActionnaireUpdated) => {
  const { projectId, newActionnaire } = event.payload
  const ProjectModel = models.Project
  const projectInstance = await ProjectModel.findByPk(projectId)

  if (!projectInstance) {
    logger.error(
      `Error: onProjectActionnaireUpdated projection failed to retrieve project from db: ${event}`
    )
    return
  }

  projectInstance.actionnaire = newActionnaire

  try {
    await projectInstance.save()
  } catch (e) {
    logger.error(e)
    logger.info('Error: onProjectActionnaireUpdated projection failed to update project', event)
  }
}
