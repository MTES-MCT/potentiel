import { logger } from '../../../../../core/utils'
import { ProjectDCRSubmitted } from '../../../../../modules/project/events'

export const onProjectDCRSubmitted = (models) => async (event: ProjectDCRSubmitted) => {
  const { projectId, numeroDossier } = event.payload
  const { Project } = models
  const projectInstance = await Project.findByPk(projectId)

  if (!projectInstance) {
    logger.error(
      `Error: onProjectDCRSubmitted projection failed to retrieve project from db ${event}`
    )
    return
  }

  projectInstance.numeroGestionnaire = numeroDossier

  try {
    await projectInstance.save()
  } catch (e) {
    logger.error(e)
    logger.info('Error: onProjectDCRSubmitted projection failed to update project', event)
  }
}
