import { logger } from '@core/utils'
import { ContratEnedisRapprochéAutomatiquement } from '@modules/enedis'

export const onContratEnedisRapprochéAutomatiquement =
  (models) => async (event: ContratEnedisRapprochéAutomatiquement) => {
    const { projectId, numero } = event.payload
    const { Project } = models
    const projectInstance = await Project.findByPk(projectId)

    if (!projectInstance) {
      logger.error(
        `Error: onEnedisContractAutomaticallyLinkedToProject projection failed to retrieve project from db: ${event}`
      )
      return
    }

    projectInstance.contratEnedis = {
      numero,
    }

    try {
      await projectInstance.save()
    } catch (e) {
      logger.error(e)
      logger.info(
        'Error: onEnedisContractAutomaticallyLinkedToProject projection failed to update project',
        event
      )
    }
  }
