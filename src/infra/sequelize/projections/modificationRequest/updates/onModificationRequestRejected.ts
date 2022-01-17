import { logger } from '../../../../../core/utils'
import { ModificationRequestRejected } from '@modules/modificationRequest'

export const onModificationRequestRejected = (models) => async (
  event: ModificationRequestRejected
) => {
  const ModificationRequestModel = models.ModificationRequest
  const instance = await ModificationRequestModel.findByPk(event.payload.modificationRequestId)

  if (!instance) {
    logger.error(
      `Error: onModificationRequestRejected projection failed to retrieve project from db ${event}`
    )
    return
  }

  const {
    occurredAt,
    payload: { rejectedBy, responseFileId },
  } = event

  Object.assign(instance, {
    status: 'rejetée',
    respondedOn: occurredAt.getTime(),
    respondedBy: rejectedBy,
    versionDate: occurredAt,
    responseFileId,
  })

  try {
    await instance.save()
  } catch (e) {
    logger.error(e)
    logger.info('Error: onModificationRequestRejected projection failed to update project :', event)
  }
}
