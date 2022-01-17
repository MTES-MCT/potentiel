import { logger } from '../../../../../core/utils'
import { ModificationRequestConfirmed } from '@modules/modificationRequest'

export const onModificationRequestConfirmed = (models) => async (
  event: ModificationRequestConfirmed
) => {
  const { ModificationRequest } = models
  const instance = await ModificationRequest.findByPk(event.payload.modificationRequestId)

  if (!instance) {
    logger.error(
      `Error: onModificationRequestConfirmed projection failed to retrieve modification request from db ${event}`
    )

    return
  }

  const {
    payload: { confirmedBy },
    occurredAt,
  } = event
  Object.assign(instance, {
    status: 'demande confirmée',
    confirmedBy,
    confirmedOn: occurredAt.getTime(),
    versionDate: occurredAt,
  })

  try {
    await instance.save()
  } catch (e) {
    logger.error(e)
    logger.info(
      'Error: onModificationRequestConfirmed projection failed to update modification request :',
      event
    )
  }
}
