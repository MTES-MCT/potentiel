import { logger } from '@core/utils'
import { DemandeDelaiSignaled } from '@modules/project'

export const onDemandeDelaiSignaled =
  (models) =>
  async ({
    payload: { isAccepted, isNewDateApplicable, projectId, newCompletionDueOn },
  }: DemandeDelaiSignaled) => {
    if (isAccepted && isNewDateApplicable) {
      const ProjectModel = models.Project
      const projectInstance = await ProjectModel.findByPk(projectId)

      if (!projectInstance) {
        logger.error(
          `Error: DemandeDelaiSignaled projection failed to retrieve project from db': ${event}`
        )
        return
      }

      projectInstance.completionDueOn = newCompletionDueOn

      try {
        await projectInstance.save()
      } catch (e) {
        logger.error(e)
        logger.info('Error: DemandeDelaiSignaled projection failed to update project', event)
      }
    }
  }
