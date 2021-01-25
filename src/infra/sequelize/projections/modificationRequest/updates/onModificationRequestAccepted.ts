import { logger } from '../../../../../core/utils'
import { ModificationRequestAccepted } from '../../../../../modules/modificationRequest/events'

export const onModificationRequestAccepted = (models) => async (
  event: ModificationRequestAccepted
) => {
  const ModificationRequestModel = models.ModificationRequest
  const instance = await ModificationRequestModel.findByPk(event.payload.modificationRequestId)

  if (!instance) {
    logger.error(
      `Error: onModificationRequestAccepted projection failed to retrieve project from db ${event}`
    )
    return
  }

  const {
    occurredAt,
    payload: { acceptedBy },
  } = event

  Object.assign(instance, {
    status: 'acceptée',
    respondedOn: occurredAt.getTime(),
    respondedBy: acceptedBy,
    versionDate: occurredAt,
  })

  try {
    await instance.save()
  } catch (e) {
    logger.error(e)
    logger.info('Error: onModificationRequestAccepted projection failed to update project :', event)
  }
}
