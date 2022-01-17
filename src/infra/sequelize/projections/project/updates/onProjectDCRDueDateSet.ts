import { logger } from '@core/utils'
import { ProjectDCRDueDateSet } from '@modules/project'

export const onProjectDCRDueDateSet = (models) => async (event: ProjectDCRDueDateSet) => {
  const ProjectModel = models.Project
  const projectInstance = await ProjectModel.findByPk(event.payload.projectId)

  if (!projectInstance) {
    logger.error(
      `Error: onProjectDCRDueDateSet projection failed to retrieve project from db': ${event}`
    )
    return
  }

  // update dcrDueOn
  projectInstance.dcrDueOn = event.payload.dcrDueOn

  try {
    await projectInstance.save()
  } catch (e) {
    logger.error(e)
    logger.info('Error: onProjectDCRDueDateSet projection failed to update project', event)
  }
}
