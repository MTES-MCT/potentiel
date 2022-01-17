import { logger } from '@core/utils'
import { NumeroGestionnaireSubmitted } from '@modules/project'

export const onNumeroGestionnaireSubmitted = (models) => async (
  event: NumeroGestionnaireSubmitted
) => {
  const { projectId, numeroGestionnaire } = event.payload
  const { Project } = models
  const projectInstance = await Project.findByPk(projectId)

  if (!projectInstance) {
    logger.error(
      `Error: onNumeroGestionnaireSubmitted projection failed to retrieve project from db ${event}`
    )
    return
  }

  projectInstance.numeroGestionnaire = numeroGestionnaire

  try {
    await projectInstance.save()
  } catch (e) {
    logger.error(e)
    logger.info('Error: onNumeroGestionnaireSubmitted projection failed to update project', event)
  }
}
