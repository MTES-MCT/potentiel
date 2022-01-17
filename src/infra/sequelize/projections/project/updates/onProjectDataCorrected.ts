import { logger } from '../../../../../core/utils'
import { ProjectDataCorrected } from '@modules/project'

export const onProjectDataCorrected = (models) => async (event: ProjectDataCorrected) => {
  const ProjectModel = models.Project
  const projectInstance = await ProjectModel.findByPk(event.payload.projectId)

  if (!projectInstance) {
    logger.error(
      `Error: onProjectDataCorrected projection failed to retrieve project from db ${event}`
    )
    return
  }

  Object.assign(projectInstance, event.payload.correctedData)

  try {
    await projectInstance.save()
  } catch (e) {
    logger.error(e)
    logger.info('Error: onProjectDataCorrected projection failed to update project', event)
  }
}
