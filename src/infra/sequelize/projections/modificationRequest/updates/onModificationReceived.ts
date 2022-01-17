import { logger } from '@core/utils'
import { ModificationReceived } from '@modules/modificationRequest'

export const onModificationReceived = (models) => async (event: ModificationReceived) => {
  const ModificationRequestModel = models.ModificationRequest
  const {
    modificationRequestId,
    projectId,
    requestedBy,
    puissance,
    justification,
    fileId,
    type,
    actionnaire,
    producteur,
    fournisseurs,
    evaluationCarbone,
    authority,
  } = event.payload

  try {
    await ModificationRequestModel.create({
      id: modificationRequestId,
      projectId,
      requestedOn: event.occurredAt.getTime(),
      versionDate: event.occurredAt,
      status: 'information validée',
      type,
      userId: requestedBy,
      producteur,
      puissance,
      justification,
      fileId,
      actionnaire,
      fournisseurs,
      evaluationCarbone,
      authority,
    })
  } catch (e) {
    logger.error(e)
    logger.info('Error: onModificationReceived projection failed to update project :', event)
  }
}
