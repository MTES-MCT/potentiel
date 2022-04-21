import { logger } from '@core/utils'
import { DemandeDelaiSignaled } from '@modules/project'

export const onDemandeDelaiSignaled =
  (models) =>
  async ({ payload }: DemandeDelaiSignaled) => {
    const { status, projectId } = payload

    if (status === 'acceptée' && payload.isNewDateApplicable) {
      const { Project } = models
      const projectInstance = await Project.findByPk(projectId)

      if (!projectInstance) {
        logger.error(
          `Error: DemandeDelaiSignaled projection failed to retrieve project from db': ${event}`
        )
        return
      }

      projectInstance.completionDueOn = payload.newCompletionDueOn

      try {
        await projectInstance.save()
      } catch (e) {
        logger.error(e)
        logger.info('Error: DemandeDelaiSignaled projection failed to update project', event)
      }
    }
  }
