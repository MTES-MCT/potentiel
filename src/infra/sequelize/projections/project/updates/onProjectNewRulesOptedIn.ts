import { logger } from '../../../../../core/utils'
import { ProjectNewRulesOptedIn } from '@modules/project'

export const onProjectNewRulesOptedIn = (models) => async (event: ProjectNewRulesOptedIn) => {
  const { projectId } = event.payload
  const { Project } = models
  const projectInstance = await Project.findByPk(projectId)

  if (!projectInstance) {
    logger.error(
      `Error: onProjectNewRulesOptedIn projection failed to retrieve project from db: ${event}`
    )
    return
  }

  projectInstance.newRulesOptIn = true

  try {
    await projectInstance.save()
  } catch (e) {
    logger.error(e)
    logger.info('Error: onProjectNewRulesOptedIn projection failed to update project', event)
  }
}
