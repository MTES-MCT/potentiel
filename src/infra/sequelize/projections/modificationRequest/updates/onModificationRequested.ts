import { logger } from '../../../../../core/utils'
import { ModificationRequested } from '../../../../../modules/modificationRequest'

export const onModificationRequested = (models) => async (event: ModificationRequested) => {
  const ModificationRequestModel = models.ModificationRequest

  const {
    modificationRequestId,
    type,
    projectId,
    fileId,
    justification,
    requestedBy,
    puissance,
    delayInMonths,
    actionnaire,
    authority,
  } = event.payload
  try {
    await ModificationRequestModel.create({
      id: modificationRequestId,
      projectId,
      type,
      requestedOn: event.occurredAt.getTime(),
      versionDate: event.occurredAt,
      status: 'envoyée',
      fileId,
      userId: requestedBy,
      justification,
      puissance,
      delayInMonths,
      actionnaire,
      authority,
    })
  } catch (e) {
    logger.error(e)
  }
}
