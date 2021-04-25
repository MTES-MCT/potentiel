import { logger } from '../../../../../core/utils'
import { ModificationReceived } from '../../../../../modules/modificationRequest/events'

export const onModificationReceived = (models) => async (event: ModificationReceived) => {
  const ModificationRequestModel = models.ModificationRequest
  const {
    modificationRequestId,
    projectId,
    requestedBy,
    puissance,
    justification,
    fileId,
  } = event.payload

  try {
    await ModificationRequestModel.create({
      id: modificationRequestId,
      projectId,
      requestedOn: event.occurredAt.getTime(),
      versionDate: event.occurredAt,
      status: 'information validée',
      type: 'puissance',
      userId: requestedBy,
      puissance,
      justification,
      fileId,
    })
  } catch (e) {
    logger.error(e)
    logger.info('Error: onModificationReceived projection failed to update project :', event)
  }
}
