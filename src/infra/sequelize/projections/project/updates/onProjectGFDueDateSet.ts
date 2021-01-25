import { logger } from '../../../../../core/utils'
import { ProjectGFDueDateSet } from '../../../../../modules/project/events'

export const onProjectGFDueDateSet = (models) => async (event: ProjectGFDueDateSet) => {
  const ProjectModel = models.Project
  const projectInstance = await ProjectModel.findByPk(event.payload.projectId)

  if (!projectInstance) {
    logger.error(
      `Error: onProjectGFDueDateSet projection failed to retrieve project from db': ${event}`
    )
    return
  }

  // update garantiesFinancieresDueOn
  projectInstance.garantiesFinancieresDueOn = event.payload.garantiesFinancieresDueOn

  try {
    await projectInstance.save()
  } catch (e) {
    logger.error(e)
    logger.info('Error: onProjectGFDueDateSet projection failed to update project', event)
  }
}
