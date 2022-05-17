import { logger } from '@core/utils'
import { EDFContractUpdated } from '@modules/edf'

export const onEDFContractUpdated = (models) => async (event: EDFContractUpdated) => {
  const { projectId, numero, type, dateEffet, dateSignature, dateMiseEnService, statut, duree } =
    event.payload
  const { Project } = models
  const projectInstance = await Project.findByPk(projectId)

  if (!projectInstance) {
    logger.error(
      `Error: onEDFContractUpdated projection failed to retrieve project from db: ${event}`
    )
    return
  }

  Object.assign(projectInstance.contratEDF, {
    numero,
    ...(type ? { type } : undefined),
    ...(dateEffet ? { dateEffet } : undefined),
    ...(dateSignature ? { dateSignature } : undefined),
    ...(dateMiseEnService ? { dateMiseEnService } : undefined),
    ...(statut ? { statut } : undefined),
    ...(duree ? { duree: Number(duree) } : undefined),
  })
  projectInstance.changed('contratEDF', true)

  try {
    await projectInstance.save()
  } catch (e) {
    logger.error(e)
    logger.info('Error: onEDFContractUpdated projection failed to update project', event)
  }
}
