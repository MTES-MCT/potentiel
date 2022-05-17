import { logger } from '@core/utils'
import { EDFContractAutomaticallyLinkedToProject } from '@modules/edf'

export const onEDFContractAutomaticallyLinkedToProject =
  (models) => async (event: EDFContractAutomaticallyLinkedToProject) => {
    const { projectId, numero, type, dateEffet, dateSignature, dateMiseEnService, statut, duree } =
      event.payload
    const { Project } = models
    const projectInstance = await Project.findByPk(projectId)

    if (!projectInstance) {
      logger.error(
        `Error: onEDFContractAutomaticallyLinkedToProject projection failed to retrieve project from db: ${event}`
      )
      return
    }

    projectInstance.contratEDF = {
      numero,
      type,
      dateEffet,
      dateSignature,
      dateMiseEnService,
      statut,
      duree: duree && Number(duree),
    }

    try {
      await projectInstance.save()
    } catch (e) {
      logger.error(e)
      logger.info(
        'Error: onEDFContractAutomaticallyLinkedToProject projection failed to update project',
        event
      )
    }
  }
