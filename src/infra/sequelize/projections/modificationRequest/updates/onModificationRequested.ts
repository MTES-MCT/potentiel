import { logger } from '@core/utils'
import { ModificationRequested } from '@modules/modificationRequest'

export const onModificationRequested = (models) => async (event: ModificationRequested) => {
  const ModificationRequestModel = models.ModificationRequest

  const { modificationRequestId, type, projectId, fileId, justification, requestedBy, authority } =
    event.payload
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
      puissance: type === 'puissance' && event.payload.puissance,
      delayInMonths: type === 'delai' && event.payload.delayInMonths,
      actionnaire: type === 'actionnaire' && event.payload.actionnaire,
      authority,
    })
  } catch (e) {
    logger.error(e)
  }
}
